// Enum type definitions for Prisma enums
export type Role = 'ADMIN' | 'MENTOR' | 'USER' | 'MODERATOR';
export type InvoiceStatus = 'PENDING' | 'PAID' | 'CANCELLED' | 'REFUNDED';
export type MeetingStatus = 'SCHEDULED' | 'STARTED' | 'ENDED' | 'CANCELLED';

// Export role constants
export const UserRoles = {
  ADMIN: 'ADMIN' as const,
  MENTOR: 'MENTOR' as const,
  USER: 'USER' as const,
  MODERATOR: 'MODERATOR' as const,
};

export const InvoiceStatuses = {
  PENDING: 'PENDING' as const,
  PAID: 'PAID' as const,
  CANCELLED: 'CANCELLED' as const,
  REFUNDED: 'REFUNDED' as const,
};

export const MeetingStatuses = {
  SCHEDULED: 'SCHEDULED' as const,
  STARTED: 'STARTED' as const,
  ENDED: 'ENDED' as const,
  CANCELLED: 'CANCELLED' as const,
};
