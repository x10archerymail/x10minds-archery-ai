import { useEffect, useRef, useState } from "react";

interface CustomCursorProps {
  themeMode?: "dark" | "light";
}

const CustomCursor: React.FC<CustomCursorProps> = ({ themeMode = "dark" }) => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const isDark = themeMode === "dark";

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${
          e.clientY
        }px, 0) translate(-50%, -50%) scale(${
          isMouseDown ? 0.8 : isHovering ? 2.5 : 1
        })`;
      }
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest("button, a, input, select, textarea, [role='button']")
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseDown = () => setIsMouseDown(true);
    const handleMouseUp = () => setIsMouseDown(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);
    document.documentElement.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.documentElement.removeEventListener(
        "mouseleave",
        handleMouseLeave,
      );
      document.documentElement.removeEventListener(
        "mouseenter",
        handleMouseEnter,
      );
    };
  }, [isVisible, isHovering, isMouseDown]);

  if (typeof window === "undefined") return null;

  return (
    <>
      <style>{`
        * {
          cursor: none !important;
        }
        @media (max-width: 1024px) {
          * {
            cursor: auto !important;
          }
          .custom-cursor-wrapper {
            display: none !important;
          }
        }
      `}</style>
      <div
        className={`custom-cursor-wrapper pointer-events-none fixed inset-0 z-[2147483647] transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Optimized Cursor Dot */}
        <div
          ref={cursorRef}
          className="fixed left-0 top-0 w-3 h-3 rounded-full pointer-events-none"
          style={{
            backgroundColor:
              isHovering || isMouseDown
                ? "#FFD700"
                : isDark
                  ? "white"
                  : "black", // Theme-aware color
            boxShadow: isHovering ? "0 0 20px rgba(255, 215, 0, 0.5)" : "none",
            transition: "background-color 0.2s, box-shadow 0.2s",
            willChange: "transform",
          }}
        />
        {/* Trail Effect (Optional, sleek) */}
        {isHovering && (
          <div
            className="absolute -inset-2 border border-[#FFD700]/30 rounded-full animate-ping pointer-events-none"
            style={{
              left: cursorRef.current?.style.left,
              top: cursorRef.current?.style.top,
            }}
          />
        )}
      </div>
    </>
  );
};

export default CustomCursor;
