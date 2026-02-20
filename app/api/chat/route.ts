import { streamText, UIMessage, convertToModelMessages } from 'ai';
import { google } from '@ai-sdk/google';
import { tools } from './tools';

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const context = `
Available Books:
1. The Pragmatic Programmer by Andrew Hunt (Programming)
2. Atomic Habits by James Clear (Self-Development)
3. Clean Code by Robert C. Martin (Programming)

Currently Borrowed Books:
- Deep Work by Cal Newport
`;

  //TODO TASK 1
  const systemPrompt = `You are a knowledgeable librarian whose job is to recommend books to students 
        based on their interests. You can recommend only books that are available and not borrowed. 
        You have the necessary tools to check for this information. The tone should be concise and 
        informational. following is the context: ${context}`;

  const result = streamText({
    model: google('gemini-2.5-flash'),
    system: systemPrompt,
    messages: await convertToModelMessages(messages),

    //TODO TASK 2 - Tool Calling
    // tools,            // Uncomment to enable tool calling
    // maxSteps: 5,      // Allow multi-step tool use (model calls tool → gets result → responds)
  });

  return result.toUIMessageStreamResponse();
}
