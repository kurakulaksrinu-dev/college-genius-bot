import { motion } from "framer-motion";
import { ClipboardList, Calendar, FileText, HelpCircle } from "lucide-react";
import Navbar from "@/components/Navbar";

const STEPS = [
  { icon: FileText, title: "Check Eligibility", desc: "10+2 or equivalent with required percentage for B.Tech. SSC/10th pass for Diploma. 10th pass for Intermediate." },
  { icon: ClipboardList, title: "Appear for EAMCET", desc: "Qualify TS/AP EAMCET for B.Tech admissions. Diploma holders can apply through ECET for lateral entry." },
  { icon: Calendar, title: "Counseling & Seat Allotment", desc: "Attend web counseling, choose VSM College, and get seat allotted based on rank and preference." },
  { icon: HelpCircle, title: "Management Quota", desc: "Limited seats available under management quota. Contact the admissions office directly for details." },
];

const ELIGIBILITY = [
  { program: "Intermediate (MPC/BiPC/CEC)", eligibility: "SSC (10th) pass with minimum 50% marks", admission: "Direct admission / Merit-based" },
  { program: "Diploma Engineering", eligibility: "SSC (10th) pass with minimum 45% marks", admission: "POLYCET counseling / Direct" },
  { program: "B.Tech", eligibility: "Intermediate (MPC) with 45% + EAMCET rank", admission: "EAMCET counseling" },
  { program: "B.Tech (Lateral Entry)", eligibility: "Diploma pass with 45% marks + ECET rank", admission: "ECET counseling" },
  { program: "M.Tech", eligibility: "B.Tech with 50% + GATE score", admission: "GATE / PGECET counseling" },
  { program: "MBA", eligibility: "Graduation with 50% + ICET rank", admission: "ICET counseling" },
];

const Admissions = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="gradient-hero py-16">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">Admissions</h1>
            <p className="text-white/70 max-w-lg mx-auto">
              Your journey to a great engineering career starts here.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Steps */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">Admission Process</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-5 rounded-2xl border border-border bg-card"
            >
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center mb-3">
                <step.icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="text-xs text-secondary font-bold mb-1">Step {i + 1}</div>
              <h3 className="font-semibold text-foreground mb-1">{step.title}</h3>
              <p className="text-xs text-muted-foreground">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Eligibility Table */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold text-foreground mb-6">Eligibility & Admission Mode</h2>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-3 font-semibold text-foreground">Program</th>
                <th className="text-left p-3 font-semibold text-foreground">Eligibility</th>
                <th className="text-left p-3 font-semibold text-foreground">Admission Mode</th>
              </tr>
            </thead>
            <tbody>
              {ELIGIBILITY.map((row) => (
                <tr key={row.program} className="border-t border-border">
                  <td className="p-3 font-medium text-foreground">{row.program}</td>
                  <td className="p-3 text-muted-foreground">{row.eligibility}</td>
                  <td className="p-3 text-muted-foreground">{row.admission}</td>
                </tr>
              ))}
            </tbody>
          </table>
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

export default Admissions;
