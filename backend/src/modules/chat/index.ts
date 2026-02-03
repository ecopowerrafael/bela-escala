import { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma.js";

const openAiUrl = "https://api.openai.com/v1/chat/completions";

const buildContext = (entries: { title: string; content: string }[]) =>
	entries
		.map((entry, index) => `[#${index + 1}] ${entry.title}\n${entry.content}`)
		.join("\n\n");

export const registerChatModule = async (app: FastifyInstance) => {
	app.post("/chat", async (request) => {
		const { message } = request.body as { message?: string };

		if (!message) {
			return { error: "Message is required" };
		}

		const terms = message
			.split(/\s+/)
			.map((term) => term.trim())
			.filter((term) => term.length >= 3)
			.slice(0, 6);

		const entries = await prisma.knowledgeBaseEntry.findMany({
			where: {
				OR: [
					{ title: { search: message } },
					{ content: { search: message } },
					...terms.map((term) => ({ title: { search: term } })),
					...terms.map((term) => ({ content: { search: term } })),
					...terms.map((term) => ({ tags: { has: term } }))
				]
			},
			take: 5,
			select: { title: true, content: true }
		});

		const context = buildContext(entries);

		if (!process.env.OPENAI_API_KEY) {
			return {
				answer: "Ambiente sem chave OpenAI. Resposta baseada na base de conhecimento local.",
				sources: entries
			};
		}

		const payload = {
			model: "gpt-4o-mini",
			messages: [
				{
					role: "system",
					content:
						"Você é o Agente de Suporte Bela Escala. Responda de forma objetiva e premium. Use somente as fontes fornecidas."
				},
				{
					role: "user",
					content: `Contexto:\n${context}\n\nPergunta: ${message}`
				}
			],
			temperature: 0.2
		};

		const response = await fetch(openAiUrl, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
				"Content-Type": "application/json"
			},
			body: JSON.stringify(payload)
		});

		if (!response.ok) {
			const errorText = await response.text();
			return { error: "OpenAI request failed", details: errorText };
		}

		const data = (await response.json()) as {
			choices?: { message?: { content?: string } }[];
		};

		const answer = data.choices?.[0]?.message?.content ?? "Sem resposta";

		return { answer, sources: entries };
	});
};
