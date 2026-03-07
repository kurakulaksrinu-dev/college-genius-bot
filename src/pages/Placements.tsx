import { motion } from "framer-motion";
import { TrendingUp, Users, Building2, Award } from "lucide-react";
import Navbar from "@/components/Navbar";

const STATS = [
  { icon: TrendingUp, label: "Highest Package", value: "₹12 LPA" },
  { icon: Users, label: "Students Placed (2024)", value: "85%" },
  { icon: Building2, label: "Companies Visited", value: "50+" },
  { icon: Award, label: "Average Package", value: "₹4.5 LPA" },
];

const COMPANIES = [
  "TCS", "Infosys", "Wipro", "HCL Technologies", "Tech Mahindra", "Cognizant",
  "Accenture", "Capgemini", "IBM", "DXC Technology", "Mphasis", "Mindtree",
  "L&T Infotech", "Cyient", "Virtusa", "NTT Data", "Amazon (Warehouse Ops)",
  "Deloitte", "BYJU'S", "Zoho",
];

const TRAINING = [
  { title: "Aptitude Training", desc: "Quantitative, logical reasoning, and verbal ability classes from 2nd year" },
  { title: "Technical Training", desc: "Coding bootcamps, DSA practice, and mock interviews" },
  { title: "Soft Skills", desc: "Communication, group discussion, and personality development workshops" },
  { title: "Industry Certifications", desc: "AWS, Google Cloud, Microsoft Azure, and NPTEL certifications" },
  { title: "Mock Interviews", desc: "Panel interviews with industry professionals every semester" },
  { title: "Internship Support", desc: "Summer internship tie-ups with IT companies and startups" },
];

const Placements = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="gradient-hero py-16">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">Placements</h1>
            <p className="text-white/70 max-w-lg mx-auto">
              Dedicated placement cell ensuring bright careers for our students.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-5 rounded-2xl border border-border bg-card text-center"
            >
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-3">
                <stat.icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="text-2xl font-extrabold text-foreground">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Recruiting Companies */}
      <section className="max-w-5xl mx-auto px-6 pb-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">Our Recruiters</h2>
        <div className="flex flex-wrap gap-2">
          {COMPANIES.map((c) => (
            <span key={c} className="px-3 py-1.5 rounded-lg border border-border bg-card text-sm text-foreground font-medium">
              {c}
            </span>
          ))}
        </div>
      </section>

      {/* Training Programs */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold text-foreground mb-6">Training & Development</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TRAINING.map((t, i) => (
            <motion.div
              key={t.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="p-4 rounded-xl border border-border bg-card hover:shadow-soft transition-shadow"
            >
              <h3 className="font-semibold text-foreground text-sm mb-1">{t.title}</h3>
              <p className="text-xs text-muted-foreground">{t.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border bg-card px-6 py-6">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-sm text-muted-foreground">VSM College of Engineering · AI-Powered Information System</p>
        </div>
      </footer>
    </div>
  );
};

export default Placements;
