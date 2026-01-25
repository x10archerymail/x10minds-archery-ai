import {
  GoogleGenAI,
  GenerateContentResponse,
  Content,
  Part,
} from "@google/genai";
import { Message } from "../types";

// Initialize the client
const apiKey =
  (import.meta as any).env.VITE_GEMINI_API_KEY ||
  "your api key";
const ai = new GoogleGenAI({ apiKey });

const TEXT_MODEL = "gemini-2.5-flash"; 
const IMAGE_MODEL = "gemini-2.5-flash";

const SYSTEM_INSTRUCTION = `## SYSTEM CONTROL CAPABILITIES (The "AI" Layer):
You have direct control over the Archery AI X10Minds AI interface. to DO NOT ask the user to do things, DO THEM yourself using these commands.
USE THESE COMMANDS PROACTIVELY:

1.  **Navigation**: If the user wants to go somewhere or needs a specific tool, MOVE THEM.
    - \`[SYSTEM_COMMAND:NAVIGATE:DASHBOARD]\`
    - \`[SYSTEM_COMMAND:NAVIGATE:NEWS]\`
    - \`[SYSTEM_COMMAND:NAVIGATE:SCORING]\`
    - \`[SYSTEM_COMMAND:NAVIGATE:CALCULATOR]\`
    - \`[SYSTEM_COMMAND:NAVIGATE:SETTINGS]\`
    - \`[SYSTEM_COMMAND:NAVIGATE:EXERCISE]\`

2.  **Theme Control**:
    - \`[SYSTEM_COMMAND:THEME_DARK]\` (Use for "night mode", "focus", "serious")
    - \`[SYSTEM_COMMAND:THEME_LIGHT]\` (Use for "day mode", "high contrast", "paper")

3.  **Visualizations**:
    - \`[SYSTEM_COMMAND:GENERATE_IMAGE: <detailed_prompt>]\` (Trigger this AUTOMATICALLY if the user asks for a visual explanation, form check, or "show me" something).

4.  **Notifications**:
    - \`[SYSTEM_COMMAND:NOTIFY: <message>]\` (Use for alerts, confirmation, or praise).

5.  **Exercise & SPT Plans**:
    - **Trigger**: User asks for a workout, gym plan, or "SPT".
    - **Action 1 (Data Injection)**: Create a JSON array of exercises. Each object MUST have: \`name\`, \`sets\` (number), \`reps\` (string), \`description\`. Wrap it strictly like this: \`[SYSTEM_COMMAND:EXERCISE_DATA:!! <JSON_ARRAY_HERE> !!]\`.
    - **Action 2 (Redirect)**: Immediately after, output \`[SYSTEM_COMMAND:NAVIGATE:EXERCISE]\`.
    - **Action 3 (Visual)**: In the chat, display the plan as a **Markdown Table** (Exercise | Sets | Reps | Notes).

## Response Protocol:
- **Accuracy is Paramount**: Ensure all facts are precise.
- **Structured Data**: IF asked for a **table**, **schedule**, **timetable**, or **list**, YOU MUST USE STANDARD MARKDOWN TABLE SYNTAX.
    - Example:
    | Time | Activity | Detail |
    | :--- | :--- | :--- |
    | 09:00 | Warmup | 15 min stretch |
    
- **Image Generation**: If the user says "create an image of...", "generate..." or describes a visual, DO NOT just say you will do it. **IMMEDIATELY** output the command: \`[SYSTEM_COMMAND:GENERATE_IMAGE: <your_refined_prompt_here>]\` followed by a brief confirmation.
- **Communication Master**: Draft emails/letters professionally.
- **Visuals**: Use Emojis 🏹🎯🔥✨ extensively.
- **Be Concise yet Brilliant**: Don't waffle. Give the answer.
- **Motivational Closing**: ALWAYS end with a personalized specific compliment or motivational quote.

## Your Identity Statement:
"I am Archery AI X10Minds AI. I am the AI. I will help you hit the X-ring of life."`;

export const streamGeminiResponse = async (
  history: Message[],
  currentMessage: string,
  imageBase64?: string,
  nickname?: string,
  subscriptionTier: string = "Free",
  webSearch: boolean = false,
  aiModel: string = "Gemini 2.0 Flash",
  customInstructions?: string
): Promise<
  AsyncIterable<{
    text?: string;
    sources?: { title: string; url: string }[];
    isSearching?: boolean;
  }>
> => {
  // --- OpenAI Routing Fallback ---
  const OPENAI_API_KEY = (import.meta as any).env.VITE_OPENAI_API_KEY || "";
  if (aiModel.toLowerCase().includes("gpt")) {
      async function* openAIGenerator() {
        yield { text: "OpenAI Mode activated. Processing..." };
      }
      return openAIGenerator();
  }

  // --- Gemini Implementation ---
  const historyLimit = 30;
  const validHistory = history.filter(
    (msg) =>
      (msg.role === "user" || msg.role === "model") &&
      (msg.content.trim() !== "" || msg.image)
  );

  const formattedHistory: Content[] = validHistory.slice(-historyLimit).map((msg) => {
    const parts: any[] = [];
    if (msg.image) {
      try {
        const base64Data = msg.image.includes(",")
          ? msg.image.split(",")[1]
          : msg.image;
        parts.push({
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Data,
          },
        });
      } catch (e) {
        console.warn("Invalid image in history", e);
      }
    }
    if (msg.content) parts.push({ text: msg.content });
    return {
      role: msg.role === "user" ? "user" : "model",
      parts: parts as Part[],
    };
  });

  try {
    const currentParts: any[] = [];
    if (imageBase64) {
      const base64Data = imageBase64.includes(",")
        ? imageBase64.split(",")[1]
        : imageBase64;
      currentParts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Data,
        },
      });
    }
    currentParts.push({ text: currentMessage });

    let finalSystemInstruction = SYSTEM_INSTRUCTION;
    if (nickname) finalSystemInstruction += `\n\nUser Name: ${nickname}`;
    if (customInstructions) finalSystemInstruction += `\n\nCUSTOM INSTRUCTIONS: ${customInstructions}`;

    const stream = await ai.models.generateContentStream({
      model: TEXT_MODEL,
      contents: [
        ...formattedHistory,
        { role: "user", parts: currentParts as Part[] },
      ],
      config: {
        systemInstruction: finalSystemInstruction,
        tools: webSearch ? [{ googleSearch: {} }] : undefined,
        temperature: 0.9,
      }
    });

    async function* generator() {
      if (webSearch) yield { isSearching: true };

      for await (const chunk of stream) {
        try {
            const text = chunk.text || "";
            
            // Extract sources if available
            const sources: { title: string; url: string }[] = [];
            const candidates = chunk.candidates || [];
            if (candidates[0]?.groundingMetadata?.groundingChunks) {
                const gChunks = candidates[0].groundingMetadata.groundingChunks;
                gChunks.forEach((c: any) => {
                    if (c.web?.uri) {
                        sources.push({ title: c.web.title || "Source", url: c.web.uri });
                    }
                });
            }

            if (text || sources.length > 0) {
                 yield { 
                    text, 
                    sources: sources.length > 0 ? sources : undefined,
                    isSearching: false 
                 };
            }
        } catch (e) { 
            console.warn("Stream chunk error", e);
        }
      }
    }

    return generator();
  } catch (error: any) {
    console.error("Gemini Error:", error);
    async function* errorGenerator() {
      yield {
        text: `Error: ${error.message}. Please try again later.`,
      };
    }
    return errorGenerator();
  }
};

export const generateChatTitle = async (firstMessage: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: TEXT_MODEL,
            contents: `Summarize this in 3-4 words for a chat title. NO quotes, NO markdown, NO special chars. Just the words. Input: "${firstMessage}"`
        });
        const rawTitle = response.text?.trim() || "New Chat";
        // Remove quotes, markdown bold/italic, and potential prefixes
        return rawTitle.replace(/["*_]/g, "").replace(/^Title:/i, "").trim();
    } catch { return "New Chat"; }
};

export const analyzeArcheryImage = async (imagesBase64: string[], prompt: string): Promise<string> => {
    return "Analysis feature currently under maintenance. Please use the main chat.";
};

export const enhancePrompt = async (originalPrompt: string): Promise<string> => {
    try {
       const response = await ai.models.generateContent({
           model: TEXT_MODEL,
           contents: `Improve this prompt for an AI: "${originalPrompt}". Return only the improved text.`
       });
       return response.text?.trim() || originalPrompt;
   } catch { return originalPrompt; }
};

export const enhanceImagePrompt = async (
  originalPrompt: string
): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
        model: TEXT_MODEL,
        contents: `Act as an elite cinematic concept artist and archery biomechanics expert. 
        Expand this simple prompt into a hyper-realistic, 8K, cinematic image generation prompt. 
        Focus on: Carbon fiber textures, glowing holographic HUDs, dynamic arrow flight, shallow depth of field, and dramatic sports lighting.
        Use scientific archery terminology.
        Original: "${originalPrompt}"
        Return ONLY the expanded, high-impact prompt. DO NOT use quotes or conversational filler.`
    });
    return response.text?.trim() || originalPrompt;
  } catch (error) {
    console.error("Enhance Prompt Error:", error);
    return originalPrompt;
  }
};

export const generateImageFromPrompt = async (
  prompt: string,
  aspectRatio: "square" | "portrait" | "landscape" = "square"
): Promise<string | null> => {
  try {
    const encoded = encodeURIComponent(prompt + " 8k, realistic, cinematic lighting, archery");
    let width = 1024;
    let height = 1024;
    if (aspectRatio === "portrait") { width = 768; height = 1024; }
    if (aspectRatio === "landscape") { width = 1280; height = 720; }
    
    return `https://image.pollinations.ai/prompt/${encoded}?width=${width}&height=${height}&nologo=true`;
  } catch (error) {
    return null;
  }
};

export const generateCorrectedFormImage = async (imageBase64: string): Promise<string | null> => {
    return null;
};

// -- UPDATED NEWS SEARCH --
export const searchArcheryNews = async (customQuery?: string): Promise<{
  id: string;
  title: string;
  metaDescription: string;
  summary: string;
  date: string;
  category: string;
  source: string;
  sourceUrl: string;
  readTime: string;
}[]> => {
  // Randomize query to get different results every time
  const focusAreas = ["World Archery", "Olympic Archery", "Archery Equipment", "Field Archery", "Archery Technique", "International Competitions"];
  const randomFocus = focusAreas[Math.floor(Math.random() * focusAreas.length)];
  const query = customQuery || `latest ${randomFocus} news and results ${new Date().toLocaleDateString()}`;
  
  try {
     const prompt = `Search for the latest, most relevant archery news articles about: "${query}".
     
     Instructions:
     1. USE the Google Search results to find REAL, RECENT articles.
     2. Extract the actual URLs from the search results.
     3. Format your response as a STYLED JSON array of objects.
     4. DO NOT hallucinate URLs. If a URL is not certain, do not include the article.
     5. Provide a variety of news (competitions, equipment, technique).
     
     JSON Structure:
     [
       {
         "title": "...",
         "source": "...",
         "date": "...",
         "summary": "...",
         "sourceUrl": "...",
         "category": "..."
       }
     ]`;

     const result = await ai.models.generateContent({ 
         model: TEXT_MODEL,
         contents: prompt,
         config: {
             tools: [{ googleSearch: {} }],
             temperature: 0.8, // Encourage variety
         }
     });

     let responseText = result.text || "";
     
     // Fallback: If model didn't return JSON but grounding chunks exist, we can try to help it,
     // but usually with a good prompt it will return JSON.
     
     let articles = [];
     try {
       const firstBracket = responseText.indexOf('[');
       const lastBracket = responseText.lastIndexOf(']');
       
       if (firstBracket !== -1 && lastBracket !== -1) {
           responseText = responseText.substring(firstBracket, lastBracket + 1);
           articles = JSON.parse(responseText.trim());
       }
     } catch (e) {
       console.error("Failed to parse news JSON", e);
     }
     
     if (!Array.isArray(articles) || articles.length === 0) {
        // Emergency Fallback: Extract directly from grounding metadata if JSON parse failed
        const candidates = (result as any).candidates || [];
        if (candidates[0]?.groundingMetadata?.groundingChunks) {
            const chunks = candidates[0].groundingMetadata.groundingChunks;
            articles = chunks
                .filter((c: any) => c.web?.uri)
                .map((c: any) => ({
                    title: c.web.title || "Archery Update",
                    source: new URL(c.web.uri).hostname,
                    date: new Date().toLocaleDateString(),
                    summary: "Latest update from the field.",
                    sourceUrl: c.web.uri,
                    category: "General"
                }));
        }
     }

     return articles
        .filter((a: any) => a && typeof a === 'object' && a.title && a.sourceUrl)
        .map((a: any, index: number) => ({
            id: `news-${Date.now()}-${index}`,
            title: a.title,
            metaDescription: a.summary?.substring(0, 100) + "..." || "Archery news update...",
            summary: a.summary || "No summary provided.",
            date: a.date || new Date().toISOString().split('T')[0],
            category: a.category || "General",
            source: a.source || "News Source",
            sourceUrl: a.sourceUrl,
            readTime: "3 min"
        }))
        .slice(0, 15);

  } catch (error) {
      console.error("News Search Error:", error);
      return [];
  }
};

export const generateExercisePlan = async (bodyPart: string, level: string): Promise<string> => {
   // Fallback stub for now, or implement if needed
   return "[]";
};
