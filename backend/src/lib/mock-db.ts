// Mock database para desenvolvimento local sem PostgreSQL

interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: string;
  createdAt: Date;
}

// Simular banco de dados em memória
const mockDatabase = {
  users: new Map<string, User>()
};

export const mockPrisma = {
  user: {
    findUnique: async ({ where }: { where: { email: string } }) => {
      for (const user of mockDatabase.users.values()) {
        if (user.email === where.email) {
          return user;
        }
      }
      return null;
    },
    create: async ({ data }: { data: Omit<User, "id" | "createdAt"> }) => {
      const user: User = {
        id: `user_${Date.now()}`,
        ...data,
        createdAt: new Date()
      };
      mockDatabase.users.set(user.id, user);
      return user;
    },
    findMany: async () => {
      return Array.from(mockDatabase.users.values());
    },
    update: async ({ where, data }: { where: { id: string }; data: Partial<User> }) => {
      const user = mockDatabase.users.get(where.id);
      if (!user) return null;
      const updated = { ...user, ...data };
      mockDatabase.users.set(where.id, updated);
      return updated;
    }
  }
};

export { mockDatabase };
