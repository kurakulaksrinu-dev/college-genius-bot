import { motion } from "framer-motion";
import { FlaskConical, Home, BookOpen, Dumbbell, Utensils, Wifi, Bus, Stethoscope } from "lucide-react";
import Navbar from "@/components/Navbar";

const FACILITY_CATEGORIES = [
  {
    title: "Laboratories",
    icon: FlaskConical,
    items: [
      { name: "Computer Lab (C-Block, 2nd Floor)", desc: "200+ systems with high-speed internet" },
      { name: "Physics Lab (A-Block, Ground Floor)", desc: "Modern equipment for optics, mechanics, electronics" },
      { name: "Chemistry Lab (A-Block, 1st Floor)", desc: "Fully equipped with fume hoods and analytical instruments" },
      { name: "Electronics Lab (B-Block, 1st Floor)", desc: "CROs, function generators, and PCB design stations" },
      { name: "Mechanical Workshop (D-Block)", desc: "Lathe machines, welding, and fitting stations" },
      { name: "Civil Engineering Lab (D-Block, 1st Floor)", desc: "Material testing, surveying equipment" },
    ],
  },
  {
    title: "Hostels",
    icon: Home,
    items: [
      { name: "Boys Hostel-1 (Near D-Block)", desc: "Capacity: 300, with mess facility and WiFi" },
      { name: "Boys Hostel-2 (Behind Campus)", desc: "Capacity: 200, AC rooms available" },
      { name: "Girls Hostel (Adjacent to Main Campus)", desc: "Capacity: 250, 24/7 security and warden" },
    ],
  },
  {
    title: "Library & Resources",
    icon: BookOpen,
    items: [
      { name: "Central Library (A-Block, Ground Floor)", desc: "50,000+ books, journals, and digital resources" },
      { name: "Digital Library Section", desc: "NPTEL videos, e-journals, IEEE/Springer access" },
      { name: "Reading Hall", desc: "200 seating capacity with AC" },
    ],
  },
  {
    title: "Sports & Recreation",
    icon: Dumbbell,
    items: [
      { name: "Cricket Ground", desc: "Full-size ground with practice nets" },
      { name: "Basketball & Volleyball Courts", desc: "Outdoor courts near hostel area" },
      { name: "Indoor Games Room (C-Block)", desc: "Table tennis, chess, carrom" },
      { name: "Gymnasium", desc: "Equipped with modern fitness equipment" },
    ],
  },
  {
    title: "Canteen & Dining",
    icon: Utensils,
    items: [
      { name: "Main Canteen (Near A-Block)", desc: "Affordable meals, snacks, and beverages" },
      { name: "Cafeteria (C-Block Ground Floor)", desc: "Quick bites and refreshments" },
      { name: "Hostel Mess", desc: "Veg and non-veg meal plans available" },
    ],
  },
  {
    title: "IT Infrastructure",
    icon: Wifi,
    items: [
      { name: "Campus-wide WiFi", desc: "High-speed internet across all blocks" },
      { name: "Smart Classrooms", desc: "Projectors and digital boards in every department" },
      { name: "Server Room (C-Block)", desc: "College ERP and website hosting" },
    ],
  },
  {
    title: "Transport",
    icon: Bus,
    items: [
      { name: "College Bus Service", desc: "20+ routes covering nearby towns and cities" },
      { name: "Parking Facility", desc: "Separate two-wheeler and four-wheeler parking" },
    ],
  },
  {
    title: "Medical",
    icon: Stethoscope,
    items: [
      { name: "Health Center (Near Admin Block)", desc: "On-campus doctor and first aid facility" },
      { name: "Ambulance Service", desc: "24/7 emergency vehicle available" },
    ],
  },
];

const Facilities = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="gradient-hero py-16">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">Campus Facilities</h1>
            <p className="text-white/70 max-w-lg mx-auto">
              World-class infrastructure for learning, living, and growing.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-12 space-y-10">
        {FACILITY_CATEGORIES.map((cat, ci) => (
          <motion.div
            key={cat.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: ci * 0.05 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <cat.icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <h2 className="text-xl font-bold text-foreground">{cat.title}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {cat.items.map((item) => (
                <div key={item.name} className="p-4 rounded-xl border border-border bg-card hover:shadow-soft transition-shadow">
                  <h3 className="font-semibold text-foreground text-sm mb-1">{item.name}</h3>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
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

export default Facilities;
