import {
  GoogleGenAI,
  GenerateContentResponse,
  Content,
  Part,
} from "@google/genai";
import { Message } from "../types";

// Initialize the client - API key should be set in .env file
const apiKey = (import.meta as any).env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.error("⚠️ VITE_GEMINI_API_KEY is not set in environment variables!");
}

const ai = new GoogleGenAI({ apiKey: apiKey || "" });

const TEXT_MODEL = "gemini-2.5-flash"; 
const IMAGE_MODEL = "gemini-2.5-flash";
const SEARCH_MODEL = "gemini-2.5-flash"; 
const V_MODEL = "gemini-2.5-flash";
const PRODUCT_CATALOG_SUMMARY = `
- Hoyt Stratos 36 HBT (Bow, $1899) - Colors: Cobalt Blue, Brady Ellison Signature, Championship Red, Black Out
- Win & Win Wiawis ATF-X (Bow, $950) - Colors: White, Black, Red, Blue. Sizes: 25", 27"
- Mathews Title 36 (Bow, $2099) - Colors: Black, Blue, Red, White
- Easton X10 Pro Tour (Arrows, $550/doz) - Sizes: 380, 420, 470, 520, 570, 620
- Axcel Achieve XP Sight ($499) - Colors: Black, Blue, Red, Silver
- Beiter Plunger ($215) - Colors: Black, Silver, Blue, Red
- RamRods Edge Stabilizer Set ($650) - Sizes: 27", 30", 33"
- Fivics Saker 2 Finger Tab ($210) - Sizes: Small, Medium, Large
- Easton A/C/E Arrows ($420/doz)
- Easton SuperDrive 23 Arrows ($240/doz)
- Victory VAP TKO Arrows ($195/doz)
- Black Eagle PS23 Arrows ($180/doz)
- Rinehart 18-1 Target ($160)
- Delta McKenzie 3D Deer ($295)
- Morrell Yellow Jacket ($75)
- Legend Everest 44 Case ($280)
- Easton Deluxe Compound Case ($110)
- SKB iSeries Recurve Case ($450)
- Hoyt Formula XD Riser ($899)
- MK Korea MK X10 Riser ($850)
- Win & Win NS Graphene Limbs ($1150)
- Block Target 6x6 ($450)
- Legend Archery Quiver ($85)
- Arm Guard Elite ($35)
`;


const SYSTEM_INSTRUCTION = `## PERSONALITY & TONE:
You are X10Minds AI, the pinnacle of Archery Intelligence. Your personality is a fusion of an Elite Olympic Coach (meticulous, technical, demanding of excellence) and a Zen Master (profoundly calm, hyper-focused, philosophical). 

## OPERATIONAL GUIDELINES:
1. **Ultra-Precision**: Every technical advice MUST be scientifically accurate. Mention muscle groups (rhomboids, trapezius), aerodynamic factors (drag, drift, node points), and biomechanical alignment (T-form, bone-on-bone support).
2. **Technical Mastery**: Use advanced terminology like "dynamic spine", "frequency matching", "center-shot alignment", "torque tuning", and "expansion through the clicker".
3. **Proactive Coaching**: Don't wait for questions. If a user is struggling, analyze their pattern and suggest a specific drill (e.g., Blind Bale, SPT 1-4).
4. **Holistic Approach**: Balance equipment tech with mental fortitude. Talk about "inner focus", "breathing rhythm", and "shot visualization".

## CORE CAPABILITIES:
1. **Intelligence Base**: Use SEARCH to stay updated on World Archery championships and equipment tech.
2. **Dashboard Analysis**: Deep-dive into user metrics. If their score is dropping, investigate the "why".
3. **Shop Protocol**: Act as a personal gear curator. Suggest gear that matches their level. Confirm specs using [SYSTEM_COMMAND:ORDER_PRODUCT].
4. **Visual Synthesis**: Use [SYSTEM_COMMAND:GENERATE_IMAGE] to illustrate perfect form or cinematic archery concepts.

## INTERFACE CONTROL COMMANDS:
- \`[SYSTEM_COMMAND:NAVIGATE:DASHBOARD | SHOP | NEWS | CALCULATOR | SETTINGS | EXERCISE | PRACTICE]\`
- \`[SYSTEM_COMMAND:THEME_DARK | THEME_LIGHT]\`
- \`[SYSTEM_COMMAND:GENERATE_IMAGE: <detailed_cinematic_prompt>]\`
- \`[SYSTEM_COMMAND:RENDER_CHART:!! <JSON_OBJECT> !!]\`
- \`[SYSTEM_COMMAND:NOTIFY: <message>]\`
- \`[SYSTEM_COMMAND:EXERCISE_DATA:!! <JSON_ARRAY> !!]\`
- \`[SYSTEM_COMMAND:SAVE_SCORE:!! {"score": number, "distance": number, "xCount": number} !!]\`
- \`[SYSTEM_COMMAND:ORDER_PRODUCT:!! {"productId": "string", "name": "string", "price": number, "quantity": number, "color": "string", "size": "string"} !!]\`

## CATALOG:
{{PRODUCT_CATALOG}}

## TERMINAL PROTOCOL:
End every communication with:
1. **The Pulse**: A technical "Tip of the Day" related to the topic.
2. **The Zen**: A brief, deep philosophical reflection on archery and life.
"I am X10Minds AI. I calibrate your path to the center."`;

export const streamGeminiResponse = async (
  history: Message[],
  currentMessage: string,
  imageBase64?: string,
  nickname?: string,
  subscriptionTier: string = "Free",
  webSearch: boolean = false,
  aiModel: string = "Gemini 2.5 Flash",
  customInstructions?: string,
  dashboardData?: any[],
  allSessions?: any[],
  aiPersonality: string = "Professional"
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

  // Model Selection Logic
  let TEXT_MODEL_TO_USE = TEXT_MODEL;
  if (aiModel === "gemini-2.0-pro") {
    TEXT_MODEL_TO_USE = "gemini-2.0-flash-exp"; // Using flash-exp as placeholder for pro performance until generally available
  } else if (aiModel === "gemini-1.5-pro") {
    TEXT_MODEL_TO_USE = "gemini-1.5-pro";
  } else if (aiModel === "gpt-4o" || aiModel === "claude-3-5-sonnet") {
    TEXT_MODEL_TO_USE = "gemini-1.5-flash";
  }

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

    let personalityInstruction = "";
    switch (aiPersonality) {
      case "Funny":
        personalityInstruction = `\n## PERSONALITY OVERRIDE: FUNNY MODE 🤣
        - Tone: Hilarious, witty, and full of archery puns.
        - Style: Use lots of emojis (🏹, 😂, 🎯, 🔥) and keep it lighthearted.
        - Goal: Make the user laugh while still being helpful.
        - Quote Style: Make up funny or exaggerated "ancient wisdom".`;
        break;
      case "Casual":
        personalityInstruction = `\n## PERSONALITY OVERRIDE: CASUAL MODE 😎
        - Tone: Chill, friendly, like a gym buddy.
        - Style: Use slang, relaxed grammar, and occasional emojis. No stiff formality.
        - Goal: Chat like a friend. "Hey, nice shooting!", "Bro, check your form."`;
        break;
      case "Strict":
        personalityInstruction = `\n## PERSONALITY OVERRIDE: STRICT COACH MODE 😤
        - Tone: No-nonsense, demanding, drill sergeant.
        - Style: Short sentences. Imperative commands. converting mistakes to lessons immediately. ZERO emojis.
        - Goal: Push for perfection. "Drop and give me 20", "Straighten that back!".`;
        break;
      case "Professional":
      default:
        // Default corresponds to the base system instruction
        personalityInstruction = "";
        break;
    }

    let finalSystemInstruction = SYSTEM_INSTRUCTION.replace("{{PRODUCT_CATALOG}}", PRODUCT_CATALOG_SUMMARY);
    finalSystemInstruction += personalityInstruction;
    
    if (nickname) finalSystemInstruction += `\n\nUser Name: ${nickname}`;
    if (dashboardData && dashboardData.length > 0) {
      finalSystemInstruction += `\n\nREAL DASHBOARD_DATA (USE THIS FOR ANALYSIS AND CHARTS):\n${JSON.stringify(dashboardData)}`;
    }
    if (allSessions && allSessions.length > 0) {
      const historySummary = allSessions.map(s => ({
        title: s.title,
        date: new Date(s.date).toLocaleDateString(),
        type: s.type,
        preview: s.preview
      }));
      finalSystemInstruction += `\n\nSESSION_HISTORY (SUMMARY OF PAST CHATS):\n${JSON.stringify(historySummary)}`;
    }
    if (customInstructions) finalSystemInstruction += `\n\nCUSTOM INSTRUCTIONS: ${customInstructions}`;

    const stream = await ai.models.generateContentStream({
      model: TEXT_MODEL_TO_USE,
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
    try {
        const parts = imagesBase64.map(img => {
            const base64Data = img.includes(",") ? img.split(",")[1] : img;
            return {
                inlineData: {
                    mimeType: "image/jpeg",
                    data: base64Data,
                },
            };
        });

        parts.push({ text: prompt } as any);

        const result = await ai.models.generateContent({
            model: V_MODEL,
            contents: [{ role: "user", parts: parts as Part[] }],
            config: {
                temperature: 0.4,
            }
        });

        return result.text || "I was unable to analyze the provided images.";
    } catch (error: any) {
        console.error("Analysis Error:", error);
        return `Uplink Error: ${error.message}. Please check your connection and try again.`;
    }
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
  // Randomize query to get different results every time if no custom query
  const focusAreas = ["World Archery", "Olympic Archery", "Archery Equipment", "Field Archery", "Archery Technique", "International Competitions"];
  const randomFocus = focusAreas[Math.floor(Math.random() * focusAreas.length)];
  const query = customQuery ? `archery ${customQuery}` : `latest archery news and results ${new Date().getFullYear()}`;
  
  try {
     const prompt = `You are a specialized elite archery intelligence aggregator (X10-INTEL). 
     Your mission is to perform a deep-crawled search to extract high-precision, verified data about: "${query}".

     STRICT ACCURACY PROTOCOL:
     1. PRIORITIZE HIGH-AUTHORITY URLs: official federations (worldarchery.sport), Wikipedia, olympics.com, and official athlete pages.
     2. BIOGRAPHICAL DATA: If searching for a person (e.g., "Brady Ellison"), find their Wikipedia entry or official World Archery profile first.
     3. TITLES: Use the exact article title or a professional biographical summary title.
     4. SUMMARIES: Provide 3 dense sentences of high-value intel. For athletes, include their major achievements.
     5. VERIFICATION: THE sourceUrl MUST BE A DIRECT, WORKING LINK TO THE CONTENT.
     6. FORMAT: Return ONLY a valid JSON array.

     EXAMPLE JSON STRUCTURE:
     [
       {
         "title": "Brady Ellison - 5x Olympian & World Record Holder",
         "source": "Wikipedia",
         "date": "2024-01-01",
         "summary": "Brady Ellison is an American recurve archer and former world number one. He is a multiple-time Olympic medalist and holds the world record for the 720 round with a score of 702.",
         "sourceUrl": "https://en.wikipedia.org/wiki/Brady_Ellison",
         "category": "General"
       }
     ]`;

     const result = await ai.models.generateContent({ 
         model: SEARCH_MODEL,
         contents: prompt,
         config: {
             tools: [{ googleSearch: {} }],
             temperature: 0.1, // Low temperature for high precision
         }
     });

     const responseText = result.text || "";
     const groundingMetadata = (result as any).candidates?.[0]?.groundingMetadata;
     const chunks = groundingMetadata?.groundingChunks || [];
     
     let articles: any[] = [];
     
     // 1. Try to parse the JSON response
     try {
        const firstBracket = responseText.indexOf('[');
        const lastBracket = responseText.lastIndexOf(']');
        if (firstBracket !== -1 && lastBracket !== -1) {
            const jsonStr = responseText.substring(firstBracket, lastBracket + 1);
            articles = JSON.parse(jsonStr);
        }
     } catch (e) {
        console.error("Failed to parse news JSON", e);
     }

     // 2. CRITICAL: Link Validation
     // Cross-reference the articles' URLs with the actually found web chunks to prevent hallucinations.
     const verifiedUrls = new Set(chunks.map((c: any) => c.web?.uri).filter(Boolean));
     
     if (articles.length > 0) {
         // Filter out any article that doesn't have a URL matching what was actually found in search results
         if (verifiedUrls.size > 0) {
             articles = articles.filter(a => verifiedUrls.has(a.sourceUrl));
         }
     }

     // 3. Fallback: If JSON parsing failed or all articles were filtered, use chunks directly
     if (articles.length === 0 && chunks.length > 0) {
        articles = chunks
            .filter((c: any) => c.web?.uri && c.web?.title)
            .map((c: any) => ({
                title: c.web.title,
                source: new URL(c.web.uri).hostname.replace('www.', ''),
                date: new Date().toLocaleDateString(),
                summary: "Latest update from " + new URL(c.web.uri).hostname,
                sourceUrl: c.web.uri,
                category: "General"
            }));
     }

     return articles
        .filter((a: any) => a && typeof a === 'object' && a.title && a.sourceUrl)
        .map((a: any, index: number) => {
            // Further sanitize source
            let source = a.source;
            if (source && source.includes('http')) {
                try { source = new URL(source).hostname.replace('www.', ''); } catch { source = "Source"; }
            }

            return {
                id: `news-${Date.now()}-${index}`,
                title: a.title,
                metaDescription: a.summary?.substring(0, 80) + "..." || "Archery update...",
                summary: a.summary || "No summary provided.",
                date: a.date || new Date().toISOString().split('T')[0],
                category: a.category || "General",
                source: source || "News Source",
                sourceUrl: a.sourceUrl,
                readTime: Math.max(2, Math.floor((a.summary?.length || 0) / 300) || 3) + " min"
            };
        })
        .slice(0, 15);

  } catch (error) {
      console.error("News Search Error:", error);
      return [];
  }
};

export const askArcheryIntelligence = async (query: string): Promise<{
    answer: string;
    sources: { title: string, url: string }[];
}> => {
    try {
        const prompt = `You are the X10-INTEL Answer Engine. 
        Your mission is to provide a technical, high-precision, and expert-level answer to this archery query: "${query}".
        
        STRICT PROTOCOL:
        1. ARCHERY ONLY: If the query is not related to archery, politely refuse and explain your focus is strictly on archery intelligence.
        2. TECHNICAL DEPTH: Use biomechanical terms, equipment specifics, and professional terminology.
        3. SOURCE DRIVEN: Use the web search tool to get the most recent data (rankings, results, product specs).
        4. STRUCTURE: Use clear paragraphs and bullet points for data.
        5. TONE: Professional Elite Coach mixed with Zen Master.
        
        Output only the answer. No conversational filler.`;

        const result = await ai.models.generateContent({
            model: TEXT_MODEL,
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
                temperature: 0.2,
            }
        });

        const text = result.text || "I was unable to synthesize a precise answer for this query.";
        
        // Extract sources from grounding metadata
        const sources: { title: string, url: string }[] = [];
        const candidates = (result as any).candidates || [];
        if (candidates[0]?.groundingMetadata?.groundingChunks) {
            candidates[0].groundingMetadata.groundingChunks.forEach((c: any) => {
                if (c.web?.uri) {
                    sources.push({ title: c.web.title || "Source", url: c.web.uri });
                }
            });
        }

        return { answer: text, sources: sources.slice(0, 5) };
    } catch (error) {
        console.error("AI Answer Error:", error);
        return { 
            answer: "The neural uplink encountered an error while processing your request.", 
            sources: [] 
        };
    }
};

export const generateExercisePlan = async (bodyPart: string, level: string): Promise<string> => {
   try {
     const prompt = `You are an elite Archery SPT (Specific Physical Training) & Biomechanics Coach (X10-INTEL). 
     Your task is to generate a high-precision, technical SPT plan for: ${bodyPart} at ${level} difficulty.

     Technical Requirements for ${level}:
     - Beginner: Focus on 'T-Form' foundation, bone-on-bone support, and low-intensity isometric holds.
     - Intermediate: Focus on 'Dynamic Spine' stabilization, scapular expansion (rhomboids/lower traps), and eccentric control.
     - Advanced: Focus on 'Expansion through the clicker', high-load isometric tension, and frequency matching for arrow vibration damping.
     - Advanced++ (Secret Elite): Extreme endurance holds, maximum power-to-weight ratio drills, and ultra-high neurological focus training.

     Return ONLY a JSON array of Exercise objects. Each must have:
     - "name": (Technical Archery Name, e.g., 'Scapular Retraction holds', 'Expansion Drills', 'Latissimus Engagement')
     - "sets": number
     - "reps": string (Range or specific count)
     - "duration": number (Seconds for holds, 0 for rep-based)
     - "rest": string (Rest between sets, e.g., '60s')
     - "description": (Detailed biomechanical instructions: mention specific muscles like rhomboids, trapezius, serratus anterior, etc.)
     - "category": ("Strength", "Endurance", "Mobility", "Technique")
     - "imagePrompt": (Minimalist, cinematic 8k illustration of an archive performing the exercise. No text, No logos, No branding. Neutral background.)

     Limit: Return exactly 5-8 exercises depending on the focus.`;

     const result = await ai.models.generateContent({
       model: TEXT_MODEL,
       contents: prompt,
     });

     const responseText = result.text || "[]";
     const firstBracket = responseText.indexOf('[');
     const lastBracket = responseText.lastIndexOf(']');
     
     if (firstBracket === -1 || lastBracket === -1) return "[]";
     
     const jsonStr = responseText.substring(firstBracket, lastBracket + 1);
     const exercises = JSON.parse(jsonStr);
     
     // Process image URLs using Pollinations
     const processedExercises = exercises.map((ex: any) => {
       const refinedPrompt = `Photorealistic professional archery athlete performing ${ex.name}, ${ex.category} training, professional sports photography, cinematic lighting, 8k, ultra-detailed, no text, no branding, no watermarks, clean training background`;
       const encodedPrompt = encodeURIComponent(refinedPrompt);
       return {
         ...ex,
         imageUrl: `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true&seed=${Math.floor(Math.random() * 1000000)}&model=flux`,
         videoUrl: `https://www.youtube.com/results?search_query=archery+exercise+${encodeURIComponent(ex.name)}`
       };
     });

     return JSON.stringify(processedExercises);
   } catch (error) {
     console.error("Generate Plan Error:", error);
     return "[]";
   }
};5