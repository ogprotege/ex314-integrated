import { z } from 'zod';
import { ChatService } from '@/lib/services/chatService';
import { MessageSchema } from '@/lib/validation/messageSchema';

const BodySchema = z.object({
  message: z.string().min(1),
  context: z.array(MessageSchema).optional()
});

const chatService = new ChatService();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = BodySchema.safeParse(body);

    if (!parsed.success) {
      return new Response(JSON.stringify({ error: 'Invalid input' }), {
        status: 400
      });
    }

    const { message, context } = parsed.data;

    const result = await chatService.sendMessage(message, context ?? []);
    return new Response(JSON.stringify({ result }), { status: 200 });
  } catch (err) {
    console.error('sendMessage error:', err);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500
    });
  }
}
