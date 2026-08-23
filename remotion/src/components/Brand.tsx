import { C, display, body } from "../theme";

export const Logo: React.FC<{ size?: number }> = ({ size = 84 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.26,
      background: `linear-gradient(140deg, ${C.tealDim}, #0F766E)`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: `0 18px 48px ${C.teal}33`,
    }}
  >
    <svg width={size * 0.52} height={size * 0.52} viewBox="0 0 24 24" fill="none" stroke="#EAFFFB" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10 12 5 2 10l10 5 10-5Z" />
      <path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" />
    </svg>
  </div>
);

export const Kicker: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      fontFamily: body,
      fontSize: 20,
      letterSpacing: 4,
      textTransform: "uppercase",
      color: C.teal,
      fontWeight: 600,
    }}
  >
    {children}
  </div>
);

export const Title: React.FC<{ children: React.ReactNode; size?: number }> = ({ children, size = 76 }) => (
  <div style={{ fontFamily: display, fontSize: size, fontWeight: 700, color: C.cream, lineHeight: 1.06, letterSpacing: -1.5 }}>
    {children}
  </div>
);
