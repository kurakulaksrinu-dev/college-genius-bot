import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, body } from "../theme";
import { Logo, Title } from "../components/Brand";

export const Scene6Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = (d: number) => spring({ frame: frame - d, fps, config: { damping: 200 } });

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ opacity: s(0), transform: `scale(${interpolate(s(0), [0, 1], [0.9, 1])})` }}>
        <Logo size={104} />
      </div>
      <div style={{ height: 38 }} />
      <div style={{ opacity: s(10), textAlign: "center" }}>
        <Title size={92}>College Genius Bot</Title>
      </div>
      <div style={{ height: 22 }} />
      <div
        style={{
          opacity: s(20),
          fontFamily: body,
          fontSize: 34,
          color: C.muted,
          transform: `translateY(${interpolate(s(20), [0, 1], [18, 0])}px)`,
        }}
      >
        Making college information easier to access.
      </div>
      <div style={{ height: 58 }} />
      <div style={{ width: interpolate(s(34), [0, 1], [0, 140]), height: 3, background: C.teal }} />
      <div style={{ height: 34 }} />
      <div style={{ opacity: s(44), textAlign: "center" }}>
        <div style={{ fontFamily: body, fontSize: 24, color: C.muted, letterSpacing: 2 }}>DEVELOPED BY</div>
        <div style={{ height: 12 }} />
        <div style={{ fontFamily: body, fontSize: 40, color: C.cream, fontWeight: 600 }}>K. Srinu</div>
        <div style={{ fontFamily: body, fontSize: 26, color: C.muted, marginTop: 8 }}>B.Tech CSE – AI & ML</div>
      </div>
    </AbsoluteFill>
  );
};
