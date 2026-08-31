import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, body, display } from "../theme";
import { Kicker, Title } from "../components/Brand";

const items = [
  { t: "Courses", d: "Departments, programmes and semester subjects" },
  { t: "Admissions", d: "Eligibility, process and important dates" },
  { t: "Facilities", d: "Labs, library, hostels, sports and transport" },
  { t: "Placements", d: "Recruiters, training and placement records" },
  { t: "Timetables", d: "Section-wise III year class schedules" },
  { t: "Practice", d: "Typing + self-introduction practice with AI" },
];

export const Scene4Features: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = (d: number) => spring({ frame: frame - d, fps, config: { damping: 200 } });

  return (
    <AbsoluteFill style={{ padding: "96px 150px", justifyContent: "center" }}>
      <div style={{ opacity: s(0) }}>
        <Kicker>Inside the app</Kicker>
      </div>
      <div style={{ height: 18 }} />
      <div style={{ opacity: s(6), transform: `translateY(${interpolate(s(6), [0, 1], [22, 0])}px)` }}>
        <Title size={66}>Everything a student asks, in one place</Title>
      </div>
      <div style={{ height: 52 }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
        {items.map((it, i) => {
          const v = s(18 + i * 7);
          return (
            <div
              key={it.t}
              style={{
                opacity: v,
                transform: `translateY(${interpolate(v, [0, 1], [26, 0])}px)`,
                border: `1px solid ${C.line}`,
                background: "rgba(255,255,255,0.045)",
                borderRadius: 18,
                padding: "22px 26px",
              }}
            >
              <div style={{ fontFamily: display, fontSize: 30, fontWeight: 600, color: C.cream }}>{it.t}</div>
              <div style={{ fontFamily: body, fontSize: 21, color: C.muted, marginTop: 8 }}>{it.d}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
