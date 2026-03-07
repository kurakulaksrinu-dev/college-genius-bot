import { motion } from "framer-motion";
import { BookOpen, GraduationCap, Award, Briefcase } from "lucide-react";
import Navbar from "@/components/Navbar";

const COURSE_CATEGORIES = [
  {
    title: "B.Tech Programs (4 Years)",
    icon: GraduationCap,
    courses: [
      { name: "Computer Science & Engineering (CSE)", seats: 120, semesters: 8 },
      { name: "Electronics & Communication Engineering (ECE)", seats: 120, semesters: 8 },
      { name: "Electrical & Electronics Engineering (EEE)", seats: 60, semesters: 8 },
      { name: "Mechanical Engineering (ME)", seats: 120, semesters: 8 },
      { name: "Civil Engineering (CE)", seats: 60, semesters: 8 },
      { name: "Information Technology (IT)", seats: 60, semesters: 8 },
    ],
  },
  {
    title: "M.Tech Programs (2 Years)",
    icon: Award,
    courses: [
      { name: "M.Tech in Computer Science", seats: 24, semesters: 4 },
      { name: "M.Tech in VLSI Design", seats: 24, semesters: 4 },
      { name: "M.Tech in Structural Engineering", seats: 24, semesters: 4 },
    ],
  },
  {
    title: "Intermediate (2 Years)",
    icon: BookOpen,
    courses: [
      { name: "MPC (Maths, Physics, Chemistry)", seats: 200, semesters: 4 },
      { name: "BiPC (Biology, Physics, Chemistry)", seats: 100, semesters: 4 },
      { name: "CEC (Civics, Economics, Commerce)", seats: 100, semesters: 4 },
    ],
  },
  {
    title: "Diploma Programs (3 Years)",
    icon: BookOpen,
    courses: [
      { name: "Diploma in Computer Engineering", seats: 60, semesters: 6 },
      { name: "Diploma in Electronics Engineering", seats: 60, semesters: 6 },
      { name: "Diploma in Mechanical Engineering", seats: 60, semesters: 6 },
      { name: "Diploma in Civil Engineering", seats: 60, semesters: 6 },
    ],
  },
  {
    title: "MBA Program (2 Years)",
    icon: Briefcase,
    courses: [
      { name: "MBA - Finance", seats: 30, semesters: 4 },
      { name: "MBA - Marketing", seats: 30, semesters: 4 },
      { name: "MBA - HR", seats: 30, semesters: 4 },
    ],
  },
];

const SEMESTER_SUBJECTS: Record<string, Record<string, string[]>> = {
  "CSE": {
    "Semester 1": ["Engineering Mathematics-I", "Engineering Physics", "Engineering Chemistry", "English", "Programming in C", "Engineering Drawing"],
    "Semester 2": ["Engineering Mathematics-II", "Applied Physics", "Environmental Studies", "Data Structures", "Digital Logic Design", "Communication Skills"],
    "Semester 3": ["Engineering Mathematics-III", "Discrete Mathematics", "Object Oriented Programming (Java)", "Computer Organization", "Database Management Systems", "Software Engineering"],
    "Semester 4": ["Probability & Statistics", "Operating Systems", "Computer Networks", "Design & Analysis of Algorithms", "Microprocessors", "Web Technologies"],
    "Semester 5": ["Compiler Design", "Theory of Computation", "Artificial Intelligence", "Information Security", "Elective-I", "Mini Project"],
    "Semester 6": ["Machine Learning", "Cloud Computing", "Mobile Application Development", "Elective-II", "Elective-III", "Industry Project"],
    "Semester 7": ["Deep Learning", "Big Data Analytics", "Elective-IV", "Elective-V", "Major Project Phase-I", "Seminar"],
    "Semester 8": ["Major Project Phase-II", "Internship", "Comprehensive Viva"],
  },
  "ECE": {
    "Semester 1": ["Engineering Mathematics-I", "Engineering Physics", "Engineering Chemistry", "English", "Basic Electrical Engineering", "Engineering Drawing"],
    "Semester 2": ["Engineering Mathematics-II", "Applied Physics", "Electronic Devices & Circuits", "Network Theory", "C Programming", "Communication Skills"],
    "Semester 3": ["Engineering Mathematics-III", "Signals & Systems", "Analog Electronics", "Digital Electronics", "Electromagnetic Theory", "Data Structures"],
    "Semester 4": ["Probability & Statistics", "Control Systems", "Communication Systems", "Microprocessors & Microcontrollers", "Linear Integrated Circuits", "Pulse & Digital Circuits"],
    "Semester 5": ["Digital Signal Processing", "Antenna & Wave Propagation", "VLSI Design", "Embedded Systems", "Elective-I", "Mini Project"],
    "Semester 6": ["Wireless Communications", "Optical Communications", "IoT Systems", "Elective-II", "Elective-III", "Industry Project"],
    "Semester 7": ["Radar Systems", "Satellite Communication", "Elective-IV", "Elective-V", "Major Project Phase-I", "Seminar"],
    "Semester 8": ["Major Project Phase-II", "Internship", "Comprehensive Viva"],
  },
};

const Courses = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero */}
      <section className="gradient-hero py-16">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">Courses & Programs</h1>
            <p className="text-white/70 max-w-lg mx-auto">
              Comprehensive programs from Intermediate to Postgraduate, affiliated with JNTU.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Course Categories */}
      <section className="max-w-5xl mx-auto px-6 py-12 space-y-10">
        {COURSE_CATEGORIES.map((cat, ci) => (
          <motion.div
            key={cat.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: ci * 0.1 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <cat.icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <h2 className="text-xl font-bold text-foreground">{cat.title}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {cat.courses.map((c) => (
                <div key={c.name} className="p-4 rounded-xl border border-border bg-card hover:shadow-soft transition-shadow">
                  <h3 className="font-semibold text-foreground text-sm mb-2">{c.name}</h3>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span>Seats: {c.seats}</span>
                    <span>Semesters: {c.semesters}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </section>

      {/* Semester-wise Subjects */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold text-foreground mb-6">Semester-wise Subjects</h2>
        {Object.entries(SEMESTER_SUBJECTS).map(([dept, semesters]) => (
          <motion.div
            key={dept}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h3 className="text-lg font-bold text-secondary mb-4">{dept} Department</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(semesters).map(([sem, subjects]) => (
                <div key={sem} className="p-4 rounded-xl border border-border bg-card">
                  <h4 className="font-semibold text-foreground text-sm mb-2">{sem}</h4>
                  <ul className="space-y-1">
                    {subjects.map((s) => (
                      <li key={s} className="text-xs text-muted-foreground flex items-start gap-1.5">
                        <span className="text-secondary mt-0.5">•</span> {s}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </section>

      <footer className="border-t border-border bg-card px-6 py-6">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-sm text-muted-foreground">VSM College of Engineering · AI-Powered Information System</p>
        </div>
      </footer>
    </div>
  );
};

export default Courses;
