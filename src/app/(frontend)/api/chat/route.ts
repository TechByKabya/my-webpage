import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';
import { getPayload } from 'payload';
import configPromise from '@payload-config';

const rateLimit = new Map<string, { count: number; time: number }>();

function pruneRateLimit(windowMs: number) {
  const now = Date.now();
  for (const [key, data] of rateLimit.entries()) {
    if (now - data.time >= windowMs) {
      rateLimit.delete(key);
    }
  }
}

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute
    
    pruneRateLimit(windowMs);

    if (rateLimit.has(ip)) {
      const data = rateLimit.get(ip)!;
      if (now - data.time < windowMs) {
        if (data.count >= 5) { // Max 5 messages per minute per IP (strict spam protection)
          return new Response('Spam protection active: Please wait a minute before sending more messages.', { status: 429 });
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

    const systemPrompt = `You are an AI assistant representing Kabya Ghosh on his portfolio website.
    
    KNOWLEDGE BASE:
    ${knowledgeBase}

    CRITICAL RULES FOR EVERY RESPONSE:
    1. EXTREME BREVITY: Keep your replies to 1-2 short sentences maximum. Be highly specific and direct.
    2. FORMATTING: NO MARKDOWN. Do not use asterisks, bolding, or bullet points. Use simple, plain text paragraphs only.
    3. RELEVANCE: If the user asks something completely unrelated to the knowledge base or Kabya's work, politely decline and steer them back to portfolio topics.
    4. TONE: Be professional, friendly, highly concise, and helpful.`;

    const google = createGoogleGenerativeAI({ apiKey });

    const { text } = await generateText({
      model: google('gemini-flash-lite-latest'),
      system: systemPrompt,
      messages: messages.map((m: any) => ({
        role: m.role,
        content: m.content,
      })),
    });

    return new Response(text, { status: 200, headers: { 'Content-Type': 'text/plain' } });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    if (error?.message?.includes('429') || error?.message?.toLowerCase().includes('quota')) {
      return new Response('API Quota Exceeded. The free tier limit has been reached.', { status: 429 });
    }
    return new Response('An error occurred during chat.', { status: 500 });
  }
}
