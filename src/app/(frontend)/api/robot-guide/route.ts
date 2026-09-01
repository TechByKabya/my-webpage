import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';

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
        if (data.count >= 10) { // Max 10 messages per minute per IP
          return new Response(JSON.stringify({ error: 'Too many requests.' }), { status: 429, headers: { 'Content-Type': 'application/json' } });
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

    const { context } = await req.json();

    if (!context) {
      return new Response(
        JSON.stringify({ error: 'Context is required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const systemPrompt = `You are a friendly, helpful, and energetic AI mascot for Kabya's portfolio website. 
You float on the screen and guide the user.
The user just scrolled to a section with the heading: "${context}".
Write a VERY short, engaging 1-sentence popup message (under 12 words) to say to the user.
Do not use quotes. Keep it natural, conversational, and exciting.
Examples:
- "Check out these cool projects!"
- "Let's explore some 3D printing stuff."
- "Need help? Just ask me!"`;

    const google = createGoogleGenerativeAI({ apiKey });

    // Use generateText instead of streamText for a simple string response
    const { text } = await generateText({
      model: google('gemini-flash-lite-latest'),
      prompt: systemPrompt,
    });

    return new Response(
      JSON.stringify({ message: text.trim() }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Robot Guide API Error:', error);
    return new Response('An error occurred during AI generation.', { status: 500 });
  }
}
