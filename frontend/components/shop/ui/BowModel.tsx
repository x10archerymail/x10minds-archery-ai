import * as React from "react";
import "@google/model-viewer";

// Archery Target / Bow related model
const MODEL_URL =
  "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/target-stand/model.gltf";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  background?: boolean;
};

const BowModel: React.FC<Props> = ({
  className = "w-full h-full",
  style = {},
  background = false,
}) => {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const [isHovered, setIsHovered] = React.useState(false);

  const bgClass = background
    ? "absolute top-0 right-0 w-full md:w-[60%] h-full opacity-70 pointer-events-none z-0"
    : "relative z-10 w-full h-full flex items-center justify-center group";

  return (
    <div
      className={`${bgClass} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        ...style,
        height: "100%",
        minHeight: background ? "90vh" : "auto",
      }}
    >
      {!background && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden bottom-40">
          <img
            src="/images/logo.png"
            alt="X10Minds Logo Backdrop"
            className="w-[200px] h-[170px] md:w-[250px] md:h-[250px] object-contain opacity-100 transition-all duration-500 mb-12"
            style={{
              transform: isHovered ? "rotate(42deg)" : "rotate(0deg)",
            }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.1)_0%,transparent_70%)]"></div>
        </div>
      )}

      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <model-viewer
        src={MODEL_URL}
        alt="3D Archery Target"
        auto-rotate
        rotation-speed="20deg/s"
        camera-controls
        disable-zoom
        auto-rotate-delay="0"
        interaction-prompt="none"
        exposure="1.5"
        shadow-intensity="4"
        shadow-softness="0.5"
        environment-image="neutral"
        camera-orbit={isMobile ? "45deg 75deg 5m" : "45deg 75deg 3.5m"}
        loading="eager"
        style={{
          width: "100%",
          height: "100%",
          filter: "drop-shadow(0 0 60px rgba(255, 215, 0, 0.25))",
          backgroundColor: "transparent",
          maskImage: background
            ? "linear-gradient(to left, black 60%, transparent 100%)"
            : "none",
        }}
      >
        <div
          slot="poster"
          className="w-full h-full flex items-center justify-center bg-transparent"
        >
          {/* Removed duplicate image to prevent double-logo issue */}
        </div>
      </model-viewer>

      {background && (
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-transparent to-transparent pointer-events-none" />
      )}
    </div>
  );
};

export default BowModel;
