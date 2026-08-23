import { loadFont as loadSora } from "@remotion/google-fonts/Sora";
import { loadFont as loadManrope } from "@remotion/google-fonts/Manrope";

export const display = loadSora("normal", { weights: ["600", "700"], subsets: ["latin"] }).fontFamily;
export const body = loadManrope("normal", { weights: ["400", "500", "600"], subsets: ["latin"] }).fontFamily;

export const C = {
  navy: "#0A1A2B",
  navy2: "#102C46",
  panel: "#12283D",
  line: "rgba(255,255,255,0.10)",
  teal: "#2DD4BF",
  tealDim: "#14A79A",
  cream: "#F2F6F8",
  muted: "rgba(242,246,248,0.62)",
};

export const bgStyle: React.CSSProperties = {
  background: `radial-gradient(1200px 700px at 78% 8%, ${C.navy2} 0%, ${C.navy} 62%)`,
};
