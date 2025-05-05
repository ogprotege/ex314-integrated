import { z } from 'zod';
import { ChatService } from '@/lib/services/chatService';
import { MessageSchema } from '@/lib/validation/messageSchema';

const BodySchema = z.object({
  message: z.string().min(1),
  context: z.array(MessageSchema).optional()
});

const chatService = new ChatService();

export async function POST(req: Request) {
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();

  try {
    const body = await req.json();
    const parsed = BodySchema.safeParse(body);

    if (!parsed.success) {
      writer.write(encoder.encode(`event: error\ndata: Invalid input\n\n`));
      writer.close();
      return new Response(readable, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive'
        }
      });
    }

    const { message, context } = parsed.data;

    await chatService.streamMessage(
      message,
      context ?? [],
      (chunk, full) => {
        writer.write(encoder.encode(`event: chunk\ndata: ${JSON.stringify({ chunk, full })}\n\n`));
      }
    );

    writer.write(encoder.encode(`event: end\ndata: [DONE]\n\n`));
    writer.close();
  } catch (err) {
    console.error('streamMessage error:', err);
    writer.write(encoder.encode(`event: error\ndata: Server error\n\n`));
    writer.close();
  }

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive'
    }
  });
}
