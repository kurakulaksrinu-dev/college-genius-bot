import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, body, display } from "../theme";

const Line: React.FC<{ text: string; from: number; to: number; accent?: boolean }> = ({ text, from, to, accent }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inSpring = spring({ frame: frame - from, fps, config: { damping: 200 } });
  const out = interpolate(frame, [to, to + 16], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      style={{
        position: "absolute",
        left: 150,
        right: 150,
        opacity: inSpring * out,
        transform: `translateY(${interpolate(inSpring, [0, 1], [28, 0]) - (1 - out) * 22}px)`,
        fontFamily: accent ? display : body,
        fontWeight: accent ? 700 : 500,
        fontSize: accent ? 60 : 54,
        color: accent ? C.cream : C.muted,
        lineHeight: 1.2,
        letterSpacing: accent ? -1 : 0,
      }}
    >
      {text}
    </div>
  );
};

export const Scene2Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const chips = ["Fees?", "Timetable?", "Placements?", "Hostel?", "Admission dates?", "Syllabus?"];
  return (
    <AbsoluteFill style={{ justifyContent: "center" }}>
      <div style={{ position: "absolute", top: 130, left: 150, right: 150, display: "flex", flexWrap: "wrap", gap: 16 }}>
        {chips.map((c, i) => {
          const o = interpolate(frame, [i * 6, i * 6 + 14, 96, 112], [0, 1, 1, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
          return (
            <div
              key={c}
              style={{
                opacity: o,
                transform: `translateY(${(1 - o) * 12}px)`,
                fontFamily: body,
                fontSize: 26,
                color: C.cream,
                padding: "12px 22px",
                borderRadius: 999,
                border: `1px solid ${C.line}`,
                background: "rgba(255,255,255,0.04)",
              }}
            >
              {c}
            </div>
          );
        })}
      </div>
      <Line text="Finding college information can take time." from={26} to={104} />
      <Line
        text="College Genius Bot provides information through a simple AI-powered interface."
        from={118}
        to={999}
        accent
      />
    </AbsoluteFill>
  );
};
