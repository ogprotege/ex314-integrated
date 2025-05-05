import { z } from 'zod';

export const MessageSchema = z.object({
  id: z.string().uuid(),
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string().min(1),
  timestamp: z.number()
});

export type Message = z.infer<typeof MessageSchema>;
