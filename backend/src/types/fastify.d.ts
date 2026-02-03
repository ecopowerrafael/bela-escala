import "@fastify/jwt";
import "fastify";
import type { FastifyReply, FastifyRequest } from "fastify";
import type { Role } from "../lib/types.js";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    user: {
      sub: string;
      role: Role;
    };
  }
}

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    authorize: (roles: Role[]) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}
