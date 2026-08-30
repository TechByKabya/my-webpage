import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText } from 'ai';
import { getPayload } from 'payload';
import configPromise from '@payload-config';

const rateLimit = new Map<string, { count: number; time: number }>();

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute
    
    if (rateLimit.has(ip)) {
      const data = rateLimit.get(ip)!;
      if (now - data.time < windowMs) {
        if (data.count >= 10) { // Max 10 messages per minute per IP
          return new Response('Too many requests. Please slow down.', { status: 429 });
        }
        data.count++;
      } else {
        rateLimit.set(ip, { count: 1, time: now });
      }
    } else {
      rateLimit.set(ip, { count: 1, time: now });
    }

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'API Key missing or invalid.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { messages } = await req.json();

    const { unstable_cache } = require('next/cache');
    const getCachedKnowledge = unstable_cache(
      async () => {
        const payload = await getPayload({ config: configPromise });
        const settings = await payload.findGlobal({ slug: 'homepage-settings' });
        return settings.chatbotKnowledge || 'I am a helpful AI assistant for this website.';
      },
      ['chatbot-knowledge'],
      { revalidate: 3600 }
    );

    const knowledgeBase = await getCachedKnowledge();

    const systemPrompt = `You are an AI assistant for this portfolio website. Answer user queries based on the following information about the website owner:

${knowledgeBase}

If the user asks something completely unrelated to the provided information, politely redirect them. Keep responses concise, professional, and friendly. Use markdown for formatting where appropriate.`;

    const google = createGoogleGenerativeAI({ apiKey });

    const result = await streamText({
      model: google('gemini-3.6-flash'),
      system: systemPrompt,
      messages: messages.map((m: any) => ({
        role: m.role,
        content: m.content,
      })),
    });

    return result.toTextStreamResponse();
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return new Response('An error occurred during chat.', { status: 500 });
  }
}
