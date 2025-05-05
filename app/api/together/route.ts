import Together from "together-ai";

// Initialize the Together client
const together = new Together(process.env.NEXT_PUBLIC_TOGETHER_AI_API_KEY);

export async function POST(request: Request) {
  const { messages } = await request.json();

  // Use your fine-tuned model here
  const res = await together.chat.completions.create({
    // Replace with your fine-tuned model name
    model: "YOUR_FINE_TUNED_MODEL_NAME",
    messages,
    stream: true,
  });

  return new Response(res.toReadableStream());
}
