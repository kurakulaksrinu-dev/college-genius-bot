import { useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, MessageCircle, BookOpen, Users, Building } from "lucide-react";
import ChatInterface from "@/components/ChatInterface";

const Index = () => {
  const [showChat, setShowChat] = useState(false);

  if (showChat) {
    return (
      <div className="h-screen flex flex-col bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-foreground leading-tight">VSM College Assistant</h1>
            <p className="text-xs text-muted-foreground">AI-Powered College Information</p>
          </div>
          <button
            onClick={() => setShowChat(false)}
            className="ml-auto text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back
          </button>
        </header>
        <ChatInterface />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
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
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowChat(true)}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-secondary text-secondary-foreground font-semibold text-lg shadow-glow hover:brightness-110 transition-all"
            >
              <MessageCircle className="w-5 h-5" />
              Start Chatting
            </motion.button>
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
            What can you ask?
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Get instant answers about all aspects of college life at VSM.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: BookOpen, title: "Courses & Programs", desc: "B.Tech, M.Tech, MBA programs and curriculum details" },
            { icon: Users, title: "Faculty & Staff", desc: "Department heads, faculty qualifications and expertise" },
            { icon: Building, title: "Facilities", desc: "Labs, library, hostels, sports and campus amenities" },
            { icon: MessageCircle, title: "Admissions", desc: "EAMCET counseling, eligibility and application process" },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="p-5 rounded-2xl border border-border bg-card hover:shadow-soft transition-shadow cursor-pointer"
              onClick={() => setShowChat(true)}
            >
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center mb-3">
                <item.icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card px-6 py-6">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            Developed at VSM College of Engineering · AI-Powered Information System
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
