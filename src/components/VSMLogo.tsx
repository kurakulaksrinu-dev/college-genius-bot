import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";

/**
 * 3D-styled, slowly floating VSM College logo mark.
 */
const VSMLogo = ({ size = 160 }: { size?: number }) => {
  return (
    <div
      className="relative"
      style={{ width: size, height: size, perspective: 900 }}
      aria-label="VSM College of Engineering logo"
    >
      {/* soft glow */}
      <motion.div
        className="absolute inset-0 rounded-[32%] blur-2xl gradient-primary opacity-50"
        animate={{ opacity: [0.3, 0.55, 0.3], scale: [0.9, 1.05, 0.9] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* orbiting ring */}
      <motion.div
        className="absolute inset-[-10%] rounded-full border border-white/25"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: 360 }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      />

      {/* floating 3D card */}
      <motion.div
        className="relative w-full h-full rounded-[28%] gradient-primary border border-white/20 flex flex-col items-center justify-center shadow-glow"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ y: [0, -12, 0], rotateY: [-12, 12, -12], rotateX: [6, -4, 6] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="absolute inset-0 rounded-[28%] bg-gradient-to-br from-white/25 via-transparent to-transparent" />
        <GraduationCap
          className="text-white drop-shadow-lg"
          style={{ width: size * 0.32, height: size * 0.32 }}
        />
        <span
          className="font-extrabold tracking-[0.18em] text-white drop-shadow"
          style={{ fontSize: size * 0.19, lineHeight: 1.1 }}
        >
          VSM
        </span>
        <span
          className="uppercase tracking-[0.24em] text-white/70"
          style={{ fontSize: size * 0.055 }}
        >
          Engineering
        </span>
      </motion.div>
    </div>
  );
};

export default VSMLogo;
