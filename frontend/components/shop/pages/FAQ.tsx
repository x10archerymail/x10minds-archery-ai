import { useState } from "react";
import { Plus, Minus, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleGenAI } from "@google/genai";

interface FAQProps {
  themeMode?: "dark" | "light";
  accentColor?: string;
}

const FAQ: React.FC<FAQProps> = ({
  themeMode = "dark",
  accentColor = "orange",
}) => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const isDark = themeMode === "dark";

  const hexToRgb = (hex: string) => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
      : "255, 215, 0";
  };

  const accentRgb = hexToRgb(accentColor);

  const [messages, setMessages] = useState<
    { role: "user" | "agent"; text: string }[]
  >([
    {
      role: "agent",
      text: "Hello! I'm your X10Minds Assistant. Ask me anything about our archery gear, shipping, or policies.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const SHOP_CONTEXT = `
    You are the expert sales and support AI assistant for "X10Minds Shop", a premium global archery retailer.
    
    Here is your Knowledge Base:
    1. **Identity**: You are professional, enthusiastic, and knowledgeable about archery. You help beginners and pros alike.
    2. **Products**: We sell elite compound bows (Hoyt, Mathews, PSE), recurve risers (Win&Win), arrows (Easton, Victory), sights (Axcel, Shibuya), and stabilizers.
    3. **Daily Deal**: We have a "Deal of the Day" on the homepage with 30% off.
    4. **Shipping**: We ship to 150+ countries. 
       - Standard: 5-10 business days.
       - Express: 3-5 business days. 
       - All high-value items are insured.
    5. **Returns**: 30-day return window for unused items. Exchanges are easy. Dry-firing a bow voids warranty and returns.
    6. **Promo Codes**: "SAVE10" (10% off), "PROMO30" (30% off, super special).
    7. **Contact**: Support email is support@x10minds.com. Humans are available 24/7.
    
    **Rules**:
    - Keep answers concise (max 3-4 sentences) unless a detailed technical explanation is asked.
    - If asked about "dry fire", warn them strictly that it damages the bow.
    - If you strictly don't know the answer, politely suggest contacting human support.
    - Do not make up fake order statuses.
  `;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    // Add user message to UI
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setInput("");
    setIsTyping(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

      if (!apiKey) {
        throw new Error("API_KEY_MISSING");
      }

      const ai = new GoogleGenAI({ apiKey });

      // Filter history: remove previous error messages and keep only last 10 turns
      const filteredHistory = messages
        .filter(
          (m) =>
            !m.text.includes("trouble connecting") &&
            !m.text.includes("brain is missing"),
        )
        .slice(-10)
        .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.text}`)
        .join("\n");

      const prompt = `${SHOP_CONTEXT}\n\nCurrent Conversation history:\n${filteredHistory}\nUser: ${userMsg}\nAssistant:`;

      const result = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
        config: {
          maxOutputTokens: 500,
          temperature: 0.7,
        },
      });

      const text = result.text;

      if (!text) {
        throw new Error("Empty response from AI");
      }

      setMessages((prev) => [...prev, { role: "agent", text: text }]);
    } catch (error: any) {
      console.error("Gemini API Error details:", error);

      let errorMessage = "⚠️ AI Assistant Update: ";

      if (error?.message === "API_KEY_MISSING") {
        errorMessage +=
          "API Key not found. Please ensure VITE_GEMINI_API_KEY is set in your .env file and you have restarted your dev server.";
      } else if (
        error?.message?.includes("403") ||
        error?.toString().includes("403")
      ) {
        errorMessage +=
          "Access Denied (403). Your API key might be invalid, restricted to a different domain, or your region might not be supported.";
      } else if (
        error?.message?.includes("429") ||
        error?.toString().includes("429")
      ) {
        errorMessage +=
          "Rate limit exceeded (429). Please wait a few seconds before asking again.";
      } else if (
        error?.message?.includes("fetch") ||
        error?.message?.includes("network")
      ) {
        errorMessage += `Network Error: ${
          error?.message || "Connection failed"
        }. This usually happens if the Google AI API is blocked in your region or by an extension.`;
      } else if (error?.message?.includes("Safety")) {
        errorMessage +=
          "The response was blocked by safety filters. Please try asking in a different way.";
      } else {
        errorMessage += `Connection issue. (Technical details: ${
          error?.message || "Check console for more info"
        })`;
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "agent",
          text: errorMessage,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState("");

  const faqs = [
    {
      question: "What is the return policy for bows?",
      answer:
        "We offer a 30-day return policy for all bows, provided they are in original condition and haven't been dry-fired. Custom-tuned bows may be subject to a restocking fee.",
    },
    {
      question: "Do you ship internationally?",
      answer:
        "Yes, X10Minds ships to over 150 countries. Shipping costs and delivery times vary by location. All high-value items are insured during transit.",
    },
    {
      question: "How do I choose the right arrow spine?",
      answer:
        "Arrow spine depends on your draw weight and arrow length. We recommend consulting our arrow selection chart or using the contact form to get advice from our professionals.",
    },
    {
      question: "Are products covered by warranty?",
      answer:
        "Yes, all new products come with the full manufacturer's warranty. X10Minds also provides direct warranty support to help facilitate repairs or replacements.",
    },
    {
      question: "Can I try equipment before buying?",
      answer:
        "If you are located near one of our partner ranges, you can book a demo session. Check our 'Locations' page for details on certified partner centers.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards (Visa, Mastercard, Amex), PayPal, and UPI payments for supported regions. We also offer financing via Affirm for US customers.",
    },
    {
      question: "How long does custom tuning take?",
      answer:
        "Standard initial setup is free (nocking point, basic rest alignment). Full super-tuning packages typically take 3-5 business days before the bow is shipped.",
    },
  ];

  const filteredFaqs = faqs.filter(
    (f) =>
      f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="pt-32 pb-24 container mx-auto px-6">
      <style>{`
        :root {
          --accent: ${accentColor};
          --accent-rgb: ${accentRgb};
        }
      `}</style>
      <div className="max-w-3xl mx-auto">
        <header className="mb-12 text-center">
          <h1
            className={`text-6xl font-black mb-6 tracking-tighter ${isDark ? "text-white" : "text-gray-950"}`}
          >
            Elite <span className="text-[var(--accent)]">Knowledge</span>
          </h1>
          <p
            className={`font-black uppercase tracking-[0.2em] text-[10px] ${isDark ? "text-gray-500" : "text-gray-400"}`}
          >
            Mission-critical information for enthusiasts and professionals
          </p>
        </header>

        {/* AI Assistant Toggle */}
        <div className="mb-12">
          {!isChatOpen ? (
            <button
              onClick={() => setIsChatOpen(true)}
              className="w-full bg-gradient-to-r from-[var(--accent)] to-[rgba(var(--accent-rgb),0.7)] text-black font-black p-[1px] rounded-[2rem] hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-[rgba(var(--accent-rgb),0.1)]"
            >
              <div
                className={`rounded-[2rem] py-5 flex items-center justify-center gap-4 ${isDark ? "bg-neutral-900" : "bg-white"}`}
              >
                <div className="w-10 h-10 bg-[var(--accent)] rounded-full flex items-center justify-center text-black shadow-lg">
                  ✨
                </div>
                <span
                  className={`text-xs uppercase tracking-[0.2em] ${isDark ? "text-white" : "text-black"}`}
                >
                  Initialize AI Support System
                </span>
              </div>
            </button>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`rounded-[2.5rem] border overflow-hidden shadow-2xl transition-all ${
                isDark
                  ? "bg-neutral-900 border-[var(--accent)]/30 shadow-[rgba(var(--accent-rgb),0.05)]"
                  : "bg-white border-[var(--accent)]/20 shadow-gray-200"
              }`}
            >
              <div
                className={`p-6 border-b flex justify-between items-center ${isDark ? "bg-[var(--accent)]/10 border-[var(--accent)]/20" : "bg-[var(--accent)]/5 border-[var(--accent)]/10"}`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[var(--accent)] rounded-full flex items-center justify-center text-black font-black text-xs shadow-md">
                    AI
                  </div>
                  <div>
                    <span className="font-black text-xs uppercase tracking-widest text-[var(--accent)]">
                      System Assistant
                    </span>
                    <p
                      className={`text-[9px] font-black uppercase tracking-widest leading-none mt-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}
                    >
                      Online & Authorized
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className={`p-2 rounded-xl transition-colors ${isDark ? "text-gray-500 hover:text-white hover:bg-white/5" : "text-gray-400 hover:text-black hover:bg-gray-100"}`}
                >
                  <Minus size={20} />
                </button>
              </div>

              <div
                className={`h-96 overflow-y-auto p-6 space-y-6 custom-scrollbar ${isDark ? "bg-black/20" : "bg-gray-50/50"}`}
              >
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-3xl p-5 text-xs font-bold leading-relaxed shadow-sm transition-all ${
                        msg.role === "user"
                          ? "bg-[var(--accent)] text-black rounded-tr-none"
                          : isDark
                            ? "bg-white/5 text-gray-200 rounded-tl-none border border-white/5"
                            : "bg-white text-gray-800 rounded-tl-none border border-gray-100"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div
                      className={`rounded-2xl rounded-tl-none p-5 flex gap-2 items-center ${isDark ? "bg-white/5" : "bg-white border border-gray-100"}`}
                    >
                      <div className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full animate-bounce delay-100" />
                      <div className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                )}
              </div>

              <form
                onSubmit={handleSend}
                className={`p-5 border-t flex gap-3 ${isDark ? "bg-black/40 border-white/10" : "bg-white border-gray-100"}`}
              >
                <input
                  autoFocus
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Query system knowledge..."
                  className={`flex-grow rounded-2xl px-6 py-4 text-xs font-bold border transition-all focus:border-[var(--accent)] outline-none ${
                    isDark
                      ? "bg-white/5 border-white/10 text-white placeholder:text-gray-700"
                      : "bg-gray-50 border-gray-200 text-black placeholder:text-gray-400"
                  }`}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="px-8 bg-[var(--accent)] text-black rounded-2xl font-black uppercase tracking-widest text-[10px] disabled:opacity-30 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[rgba(var(--accent-rgb),0.2)]"
                >
                  Send
                </button>
              </form>
            </motion.div>
          )}
        </div>

        <div className="relative mb-12 group">
          <Search
            className={`absolute left-6 top-1/2 -translate-y-1/2 transition-colors ${isDark ? "text-gray-600 group-focus-within:text-[var(--accent)]" : "text-gray-400 group-focus-within:text-black"}`}
            size={20}
          />
          <input
            type="text"
            placeholder="Search Intelligence Base..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full border rounded-[2rem] py-5 pl-15 pr-8 focus:border-[var(--accent)] outline-none transition-all font-bold text-xs ${
              isDark
                ? "bg-white/5 border-white/10 text-white placeholder:text-gray-700"
                : "bg-white border-gray-100 text-black shadow-xl shadow-gray-200/50 placeholder:text-gray-400"
            }`}
          />
        </div>

        <div className="space-y-6">
          {filteredFaqs.map((faq, index) => (
            <div
              key={index}
              className={`rounded-[2rem] overflow-hidden border transition-all duration-500 ${
                openIndex === index
                  ? isDark
                    ? "border-[var(--accent)]/30 bg-[var(--accent)]/5 shadow-2xl shadow-[rgba(var(--accent-rgb),0.05)]"
                    : "border-[var(--accent)] bg-[var(--accent)]/5 shadow-2xl shadow-[rgba(var(--accent-rgb),0.2)]"
                  : isDark
                    ? "border-white/5 bg-white/5 hover:border-white/20"
                    : "border-gray-100 bg-white hover:border-gray-200 shadow-sm"
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-8 text-left"
              >
                <span
                  className={`font-black text-sm uppercase tracking-widest leading-loose ${
                    openIndex === index
                      ? "text-[var(--accent)]"
                      : isDark
                        ? "text-white"
                        : "text-gray-950"
                  }`}
                >
                  {faq.question}
                </span>
                <span
                  className={`p-3 rounded-xl transition-all duration-500 ${
                    openIndex === index
                      ? "bg-[var(--accent)] text-black shadow-lg shadow-[rgba(var(--accent-rgb),0.2)]"
                      : isDark
                        ? "bg-white/5 text-gray-500"
                        : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {openIndex === index ? (
                    <Minus size={16} strokeWidth={3} />
                  ) : (
                    <Plus size={16} strokeWidth={3} />
                  )}
                </span>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                  >
                    <div
                      className={`px-8 pb-8 text-xs font-bold leading-relaxed border-t pt-6 ${
                        isDark
                          ? "border-white/5 text-gray-400"
                          : "border-[var(--accent)]/20 text-gray-600"
                      }`}
                    >
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}

          {filteredFaqs.length === 0 && (
            <div
              className={`text-center py-24 text-[10px] font-black uppercase tracking-[0.3em] ${isDark ? "text-gray-600" : "text-gray-400"}`}
            >
              No intelligence found for "{searchQuery}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
