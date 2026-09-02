import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MessageCircle, Compass } from "lucide-react";
import VSMLogo from "./VSMLogo";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const Hero = ({ onExplore }: { onExplore: () => void }) => (
  <section id="home" className="relative gradient-hero overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(175_55%_40%/0.25),_transparent_60%)]" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_hsl(215_80%_40%/0.25),_transparent_55%)]" />

    <div className="relative max-w-6xl mx-auto px-6 py-20 sm:py-24 grid lg:grid-cols-2 gap-12 items-center">
      <motion.div variants={container} initial="hidden" animate="show" className="text-center lg:text-left">
        <motion.span
          variants={item}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur text-xs font-medium text-white/80 mb-5"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse-glow" />
          College Genius Bot · AI Assistant
        </motion.span>

        <motion.h1
          variants={item}
          className="text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold text-white tracking-tight leading-[1.08] mb-4"
        >
          Welcome to VSM College of Engineering
        </motion.h1>

        <motion.p variants={item} className="text-xl sm:text-2xl font-semibold text-secondary mb-4">
          Your Smart AI College Assistant
        </motion.p>

        <motion.p variants={item} className="text-white/70 max-w-xl mx-auto lg:mx-0 mb-8">
          Get instant information about courses, admissions, departments, facilities,
          placements, events, and much more.
        </motion.p>

        <motion.div variants={item} className="flex flex-wrap gap-3 justify-center lg:justify-start">
          <Link
            to="/chat"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-secondary text-secondary-foreground font-semibold shadow-glow hover:brightness-110 hover:-translate-y-0.5 active:translate-y-0 transition-all"
          >
            <MessageCircle className="w-5 h-5" />
            Start Chatting
          </Link>
          <button
            onClick={onExplore}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-white/10 border border-white/20 backdrop-blur text-white font-semibold hover:bg-white/20 hover:-translate-y-0.5 transition-all"
          >
            <Compass className="w-5 h-5" />
            Explore College
          </button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="flex justify-center"
      >
        <VSMLogo size={220} />
      </motion.div>
    </div>
  </section>
);

export default Hero;
