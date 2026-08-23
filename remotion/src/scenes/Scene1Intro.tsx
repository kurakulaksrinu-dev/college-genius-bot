import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, body } from "../theme";
import { Logo, Title } from "../components/Brand";

export const Scene1Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = (d: number) => spring({ frame: frame - d, fps, config: { damping: 200 } });

  return (
    <AbsoluteFill style={{ justifyContent: "center", paddingLeft: 150, paddingRight: 120 }}>
      <div style={{ opacity: s(0), transform: `translateY(${interpolate(s(0), [0, 1], [26, 0])}px)` }}>
        <Logo size={96} />
      </div>
      <div style={{ height: 44 }} />
      <div style={{ opacity: s(8), transform: `translateY(${interpolate(s(8), [0, 1], [34, 0])}px)` }}>
        <Title size={104}>College Genius Bot</Title>
      </div>
      <div style={{ height: 26 }} />
      <div
        style={{
          opacity: s(20),
          transform: `translateY(${interpolate(s(20), [0, 1], [24, 0])}px)`,
          fontFamily: body,
          fontSize: 38,
          color: C.cream,
          fontWeight: 500,
        }}
      >
        AI-Powered College Information Assistant
      </div>
      <div style={{ height: 34 }} />
      <div style={{ display: "flex", alignItems: "center", gap: 18, opacity: s(32) }}>
        <div style={{ width: interpolate(s(32), [0, 1], [0, 72]), height: 3, background: C.teal }} />
        <div style={{ fontFamily: body, fontSize: 27, color: C.muted, letterSpacing: 1 }}>
          VSM College of Engineering
        </div>
      </div>
    </AbsoluteFill>
  );
};
