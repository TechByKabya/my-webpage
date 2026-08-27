import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { getPayload } from 'payload';
import configPromise from '@payload-config';

export const maxDuration = 30; // 30 seconds for Vercel Hobby

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Fetch the knowledge base from Payload CMS
    const payload = await getPayload({ config: configPromise });
    const settings = await payload.findGlobal({ slug: 'homepage-settings' });
    
    // Fallback if knowledge base is empty
    const knowledgeBase = settings.chatbotKnowledge || "I am a helpful assistant for this website.";

    const systemPrompt = `You are an AI assistant for this website. You must answer user queries based on the following information:
    
    ${knowledgeBase}
    
    If the user asks something completely unrelated to the provided information, politely redirect them or say you are an AI assistant specifically for this website. Keep responses concise, professional, and friendly. Use markdown for formatting where appropriate.`;

    const result = await streamText({
      model: google('gemini-1.5-flash-latest'),
      system: systemPrompt,
      messages: messages.map((m: any) => ({
        role: m.role,
        content: m.content,
      })),
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response('An error occurred during chat.', { status: 500 });
  }
}
