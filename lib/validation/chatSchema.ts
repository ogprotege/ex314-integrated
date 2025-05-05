import { z } from 'zod';
import { MessageSchema } from './messageSchema';

export const ChatSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  messages: z.array(MessageSchema),
  createdAt: z.number(),
  updatedAt: z.number()
});

export type Chat = z.infer<typeof ChatSchema>;
