import { useRef, useEffect, useState } from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // ms
  animation?:
    | "fade-up"
    | "fade-in"
    | "slide-in-right"
    | "slide-in-left"
    | "zoom-in";
  duration?: number;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = "",
  delay = 0,
  animation = "fade-up",
  duration = 1000,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const getAnimationClass = () => {
    switch (animation) {
      case "fade-up":
        return "translate-y-10 opacity-0";
      case "fade-in":
        return "opacity-0";
      case "slide-in-right":
        return "translate-x-10 opacity-0";
      case "slide-in-left":
        return "-translate-x-10 opacity-0";
      case "zoom-in":
        return "scale-95 opacity-0";
      default:
        return "opacity-0";
    }
  };

  const getVisibleClass = () => {
    switch (animation) {
      case "fade-up":
        return "translate-y-0 opacity-100";
      case "fade-in":
        return "opacity-100";
      case "slide-in-right":
        return "translate-x-0 opacity-100";
      case "slide-in-left":
        return "translate-x-0 opacity-100";
      case "zoom-in":
        return "scale-100 opacity-100";
      default:
        return "opacity-100";
    }
  };

  return (
    <div
      ref={ref}
      className={`transition-all ease-out ${className} ${
        isVisible ? getVisibleClass() : getAnimationClass()
      }`}
      style={{
        transitionDelay: `${delay}ms`,
        transitionDuration: `${duration}ms`,
      }}
    >
      {children}
    </div>
  );
};
