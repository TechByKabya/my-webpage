import { generateText, streamText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import 'dotenv/config';

async function test() {
  const google = createGoogleGenerativeAI({ apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY });
  console.log("Testing streamText...");
  try {
    const result = await streamText({
      model: google('gemini-3.6-flash'),
      messages: [{ role: 'user', content: 'hi' }]
    });
    
    let text = "";
    for await (const chunk of result.textStream) {
      text += chunk;
    }
    console.log("Stream output:", text);
  } catch (e) {
    console.error("Stream error:", e);
  }
}
test();
