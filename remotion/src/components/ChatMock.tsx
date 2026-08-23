import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, body, display } from "../theme";

export const Bubble: React.FC<{ role: "user" | "bot"; text: string; from: number; typed?: boolean }> = ({
  role,
  text,
  from,
  typed,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - from, fps, config: { damping: 200 } });
  const chars = typed
    ? Math.floor(interpolate(frame - from, [0, Math.max(18, text.length * 0.8)], [0, text.length], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }))
    : text.length;
  const isUser = role === "user";
  return (
    <div
      style={{
        display: "flex",
        gap: 16,
        opacity: s,
        transform: `translateY(${interpolate(s, [0, 1], [18, 0])}px)`,
        marginBottom: 20,
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          flexShrink: 0,
          background: isUser ? "rgba(255,255,255,0.10)" : `linear-gradient(140deg, ${C.tealDim}, #0F766E)`,
          color: C.cream,
          fontFamily: display,
          fontSize: 18,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isUser ? "You" : "V"}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: body, fontSize: 17, color: C.muted, marginBottom: 6, fontWeight: 600 }}>
          {isUser ? "Student" : "VSM Assistant"}
        </div>
        <div
          style={{
            fontFamily: body,
            fontSize: 25,
            lineHeight: 1.45,
            color: C.cream,
            whiteSpace: "pre-wrap",
            background: isUser ? "rgba(255,255,255,0.05)" : "transparent",
            border: isUser ? `1px solid ${C.line}` : "none",
            borderRadius: 14,
            padding: isUser ? "12px 16px" : "0",
          }}
        >
          {text.slice(0, chars)}
        </div>
      </div>
    </div>
  );
};

export const ChatWindow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      position: "absolute",
      inset: "88px 150px 88px 150px",
      borderRadius: 26,
      border: `1px solid ${C.line}`,
      background: "rgba(8,20,33,0.72)",
      boxShadow: "0 40px 120px rgba(0,0,0,0.45)",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 26px", borderBottom: `1px solid ${C.line}` }}>
      <div style={{ width: 34, height: 34, borderRadius: 10, background: `linear-gradient(140deg, ${C.tealDim}, #0F766E)` }} />
      <div>
        <div style={{ fontFamily: display, fontSize: 20, color: C.cream, fontWeight: 600 }}>VSM College Assistant</div>
        <div style={{ fontFamily: body, fontSize: 15, color: C.muted }}>AI-Powered College Information</div>
      </div>
    </div>
    <div style={{ flex: 1, padding: "26px 30px", overflow: "hidden" }}>{children}</div>
  </div>
);
