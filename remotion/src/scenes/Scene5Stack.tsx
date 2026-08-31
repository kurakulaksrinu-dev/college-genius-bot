import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, body, display } from "../theme";
import { Kicker, Title } from "../components/Brand";

const rows: { k: string; v: string }[] = [
  { k: "Frontend", v: "React · TypeScript · Vite · Tailwind CSS" },
  { k: "Backend", v: "Python · FastAPI · Pydantic · REST APIs" },
  { k: "Database", v: "PostgreSQL · SQLAlchemy" },
  { k: "AI Layer", v: "Context retrieval from SQL + streaming chat completions" },
];

export const Scene5Stack: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = (d: number) => spring({ frame: frame - d, fps, config: { damping: 200 } });

  return (
    <AbsoluteFill style={{ padding: "96px 150px", justifyContent: "center" }}>
      <div style={{ opacity: s(0) }}>
        <Kicker>Built with</Kicker>
      </div>
      <div style={{ height: 18 }} />
      <div style={{ opacity: s(6), transform: `translateY(${interpolate(s(6), [0, 1], [22, 0])}px)` }}>
        <Title size={70}>A clean, modern stack</Title>
      </div>
      <div style={{ height: 54 }} />
      {rows.map((r, i) => {
        const v = s(20 + i * 10);
        return (
          <div
            key={r.k}
            style={{
              opacity: v,
              transform: `translateX(${interpolate(v, [0, 1], [-30, 0])}px)`,
              display: "flex",
              alignItems: "baseline",
              gap: 28,
              padding: "20px 0",
              borderBottom: `1px solid ${C.line}`,
            }}
          >
            <div style={{ fontFamily: display, fontSize: 27, fontWeight: 600, color: C.teal, width: 200 }}>{r.k}</div>
            <div style={{ fontFamily: body, fontSize: 29, color: C.cream }}>{r.v}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
