import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  CheckCircle,
  Circle,
} from "lucide-react";

interface ContactProps {
  themeMode?: "dark" | "light";
  accentColor?: string;
}

const Contact: React.FC<ContactProps> = ({
  themeMode = "dark",
  accentColor = "orange",
}) => {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [popupStatus, setPopupStatus] = useState<"success" | "error" | null>(
    null,
  );

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    try {
      if (!formState.name || !formState.email || !formState.message) {
        throw new Error("Missing fields");
      }

      await new Promise((resolve) => setTimeout(resolve, 1500));
      setPopupStatus("success");
      setFormState({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      setPopupStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const closePopup = () => setPopupStatus(null);

  return (
    <div className="pt-32 pb-24 container mx-auto px-6 relative">
      <style>{`
        :root {
          --accent: ${accentColor};
          --accent-rgb: ${accentRgb};
        }
      `}</style>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[var(--accent)] font-black tracking-[0.4em] uppercase text-[10px] mb-6 block"
            >
              Support Synchronization
            </motion.span>
            <h1
              className={`text-6xl font-black mb-8 tracking-tighter ${isDark ? "text-white" : "text-gray-950"}`}
            >
              Secure <span className="text-[var(--accent)]">Comms</span>
            </h1>
            <p
              className={`text-sm font-black uppercase tracking-[0.2em] mb-12 max-w-md ${isDark ? "text-gray-500" : "text-gray-400"}`}
            >
              Establish a direct uplink with our technical advisor squad for
              tactical assistance and mission support.
            </p>

            <div className="space-y-12">
              {[
                {
                  icon: Mail,
                  label: "Neural Link",
                  value: "x10minds@gmail.com",
                },
              ].map((item, i) => (
                <div key={i} className="flex gap-8 items-center group">
                  <div
                    className={`w-20 h-20 rounded-3xl flex items-center justify-center transition-all duration-500 border ${
                      isDark
                        ? "bg-neutral-900 border-white/5 group-hover:bg-[var(--accent)] group-hover:text-black shadow-2xl group-hover:shadow-[rgba(var(--accent-rgb),0.3)]"
                        : "bg-white border-gray-100 group-hover:bg-[rgba(var(--accent-rgb),0.1)] group-hover:text-[var(--accent)] shadow-xl shadow-gray-200"
                    }`}
                  >
                    <item.icon size={28} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p
                      className={`text-[10px] font-black uppercase tracking-widest mb-2 ${isDark ? "text-gray-600" : "text-gray-400"}`}
                    >
                      {item.label}
                    </p>
                    <p
                      className={`text-lg font-black tracking-tight ${isDark ? "text-white" : "text-gray-950"}`}
                    >
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`rounded-[3rem] p-10 md:p-14 border transition-all duration-500 relative overflow-hidden ${
              isDark
                ? "bg-neutral-900 border-white/5 shadow-2xl"
                : "bg-white border-gray-100 shadow-2xl shadow-gray-200/50"
            }`}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[rgba(var(--accent-rgb),0.05)] -skew-x-12 translate-x-16 -translate-y-16 pointer-events-none" />

            <h3
              className={`text-2xl font-black mb-10 flex items-center gap-4 uppercase tracking-tighter ${isDark ? "text-white" : "text-gray-950"}`}
            >
              <MessageSquare className="text-[var(--accent)]" size={28} />{" "}
              Primary Uplink
            </h3>
            <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label
                    className={`text-[10px] font-black uppercase tracking-widest ml-1 ${isDark ? "text-gray-600" : "text-gray-400"}`}
                  >
                    Operator ID
                  </label>
                  <input
                    type="text"
                    required
                    value={formState.name}
                    onChange={(e) =>
                      setFormState({ ...formState, name: e.target.value })
                    }
                    placeholder="Callsign"
                    className={`w-full rounded-[1.5rem] p-5 outline-none transition-all text-sm font-bold border ${
                      isDark
                        ? "bg-white/5 border-white/5 text-white focus:border-[var(--accent)]"
                        : "bg-gray-50 border-gray-100 text-black focus:border-[var(--accent)] shadow-inner"
                    }`}
                  />
                </div>
                <div className="space-y-3">
                  <label
                    className={`text-[10px] font-black uppercase tracking-widest ml-1 ${isDark ? "text-gray-600" : "text-gray-400"}`}
                  >
                    Neural Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formState.email}
                    onChange={(e) =>
                      setFormState({ ...formState, email: e.target.value })
                    }
                    placeholder="Email Port"
                    className={`w-full rounded-[1.5rem] p-5 outline-none transition-all text-sm font-bold border ${
                      isDark
                        ? "bg-white/5 border-white/5 text-white focus:border-[var(--accent)]"
                        : "bg-gray-50 border-gray-100 text-black focus:border-[var(--accent)] shadow-inner"
                    }`}
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label
                  className={`text-[10px] font-black uppercase tracking-widest ml-1 ${isDark ? "text-gray-600" : "text-gray-400"}`}
                >
                  Operation Title
                </label>
                <input
                  type="text"
                  value={formState.subject}
                  onChange={(e) =>
                    setFormState({ ...formState, subject: e.target.value })
                  }
                  placeholder="Subject Header"
                  className={`w-full rounded-[1.5rem] p-5 outline-none transition-all text-sm font-bold border ${
                    isDark
                      ? "bg-white/5 border-white/5 text-white focus:border-[var(--accent)]"
                      : "bg-gray-50 border-gray-100 text-black focus:border-[var(--accent)] shadow-inner"
                  }`}
                />
              </div>
              <div className="space-y-3">
                <label
                  className={`text-[10px] font-black uppercase tracking-widest ml-1 ${isDark ? "text-gray-600" : "text-gray-400"}`}
                >
                  Data Stream
                </label>
                <textarea
                  rows={5}
                  required
                  value={formState.message}
                  onChange={(e) =>
                    setFormState({ ...formState, message: e.target.value })
                  }
                  placeholder="Transmit your message here..."
                  className={`w-full rounded-[1.5rem] p-6 outline-none transition-all text-sm font-bold resize-none border ${
                    isDark
                      ? "bg-white/5 border-white/5 text-white focus:border-[var(--accent)]"
                      : "bg-gray-50 border-gray-100 text-black focus:border-[var(--accent)] shadow-inner"
                  }`}
                ></textarea>
              </div>
              <button
                disabled={isSubmitting}
                className="w-full bg-[var(--accent)] text-black font-black py-6 rounded-[1.5rem] hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-[rgba(var(--accent-rgb),0.3)] flex items-center justify-center gap-4 uppercase tracking-[0.2em] text-[10px] disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-[3px] border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Initialize Transmission <Send size={18} strokeWidth={3} />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {popupStatus && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4"
            onClick={closePopup}
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className={`border rounded-[3rem] p-12 max-w-md w-full shadow-[0_0_100px_rgba(0,0,0,0.5)] relative ${
                isDark
                  ? "bg-neutral-900 border-white/5"
                  : "bg-white border-gray-100"
              }`}
            >
              <div className="flex flex-col items-center text-center">
                <div
                  className={`w-24 h-24 rounded-3xl flex items-center justify-center mb-10 transition-colors ${
                    popupStatus === "success"
                      ? "bg-green-500/10 text-green-500"
                      : "bg-red-500/10 text-red-500"
                  }`}
                >
                  {popupStatus === "success" ? (
                    <CheckCircle size={48} strokeWidth={2} />
                  ) : (
                    <Circle size={48} strokeWidth={2} />
                  )}
                </div>
                <h3
                  className={`text-2xl font-black mb-4 uppercase tracking-tighter ${isDark ? "text-white" : "text-gray-950"}`}
                >
                  {popupStatus === "success"
                    ? "Link Authorized"
                    : "Terminal Failure"}
                </h3>
                <p
                  className={`text-xs font-black uppercase tracking-widest leading-relaxed mb-10 ${isDark ? "text-gray-500" : "text-gray-400"}`}
                >
                  {popupStatus === "success"
                    ? "Your transmission has been successfully synchronized with the X10 HQ sector."
                    : "Critical error during data stream injection. Please re-initialize the terminal."}
                </p>
                <button
                  onClick={closePopup}
                  className={`w-full py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                    isDark
                      ? "bg-white/5 hover:bg-white/10 text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-950"
                  }`}
                >
                  Return to Dashboard
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Contact;
