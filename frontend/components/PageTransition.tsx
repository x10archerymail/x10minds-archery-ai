import React from "react";

interface PageTransitionProps {
  children: React.ReactNode;
  mode: any; // Unique key to trigger re-animation
  className?: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  mode,
  className = "",
}) => {
  return (
    <div
      key={mode}
      className={`animate-in fade-in slide-in-from-bottom-2 duration-300 w-full h-full flex flex-col flex-1 ${className}`}
    >
      {children}
    </div>
  );
};
