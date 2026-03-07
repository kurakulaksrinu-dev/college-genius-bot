import { motion } from "framer-motion";
import { GraduationCap, MessageCircle, BookOpen, Users, Building } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative gradient-hero overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(175_55%_40%/0.15),_transparent_60%)]" />
        <div className="relative max-w-5xl mx-auto px-6 py-20 sm:py-28 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-6 border border-white/10">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-4 tracking-tight">
              VSM College
              <span className="block text-secondary">Assistant</span>
            </h1>
            <p className="text-lg text-white/70 max-w-xl mx-auto mb-8">
              Your AI-powered guide to everything about VSM College of Engineering.
              Ask questions, get instant answers.
            </p>
            <Link
              to="/chat"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-secondary text-secondary-foreground font-semibold text-lg shadow-glow hover:brightness-110 transition-all"
            >
              <MessageCircle className="w-5 h-5" />
              Start Chatting
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
            Explore Our College
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Everything you need to know about VSM College of Engineering.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: BookOpen, title: "Courses & Programs", desc: "B.Tech, M.Tech, Intermediate, Diploma & MBA", to: "/courses" },
            { icon: Users, title: "Admissions", desc: "EAMCET counseling, eligibility and application process", to: "/admissions" },
            { icon: Building, title: "Facilities", desc: "Labs, library, hostels, sports and campus amenities", to: "/facilities" },
            { icon: MessageCircle, title: "Placements", desc: "Placement stats, recruiters, and training programs", to: "/placements" },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Link
                to={item.to}
                className="block p-5 rounded-2xl border border-border bg-card hover:shadow-soft transition-shadow"
              >
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center mb-3">
                  <item.icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card px-6 py-6">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            VSM College of Engineering · AI-Powered Information System
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
