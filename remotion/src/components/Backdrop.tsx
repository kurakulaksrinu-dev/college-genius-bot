import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, bgStyle } from "../theme";

export const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 110) * 26;
  const drift2 = Math.cos(frame / 140) * 20;
  return (
    <AbsoluteFill style={bgStyle}>
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
          backgroundSize: "84px 84px",
          transform: `translate(${drift / 6}px, ${drift2 / 6}px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 720,
          height: 720,
          right: -180 + drift,
          top: -220,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C.teal}22 0%, transparent 68%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 620,
          height: 620,
          left: -200,
          bottom: -240 + drift2,
          borderRadius: "50%",
          background: `radial-gradient(circle, #1D4ED822 0%, transparent 70%)`,
        }}
      />
    </AbsoluteFill>
  );
};
