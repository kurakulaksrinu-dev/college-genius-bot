import { GraduationCap, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer id="contact" className="border-t border-border bg-card">
    <div className="max-w-6xl mx-auto px-6 py-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-foreground">VSM College of Engineering</span>
        </div>
        <p className="text-sm text-muted-foreground max-w-xs">
          College Genius Bot — an AI-powered assistant for courses, admissions, facilities,
          placements and campus information.
        </p>
      </div>

      <div>
        <h3 className="font-semibold text-foreground mb-3 text-sm">Quick Links</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          {[
            { to: "/courses", label: "Courses" },
            { to: "/admissions", label: "Admissions" },
            { to: "/facilities", label: "Facilities" },
            { to: "/placements", label: "Placements" },
            { to: "/chat", label: "AI Assistant" },
            { to: "/practice", label: "Practice" },
          ].map((l) => (
            <li key={l.to}>
              <Link to={l.to} className="hover:text-foreground transition-colors">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-semibold text-foreground mb-3 text-sm">Contact</h3>
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li className="flex gap-2">
            <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-accent-foreground" />
            VSM College of Engineering, Ramachandrapuram, Andhra Pradesh
          </li>
          <li className="flex gap-2">
            <Mail className="w-4 h-4 mt-0.5 shrink-0 text-accent-foreground" />
            info@vsmengg.ac.in
          </li>
          <li className="flex gap-2">
            <Phone className="w-4 h-4 mt-0.5 shrink-0 text-accent-foreground" />
            +91 88573 22222
          </li>
        </ul>
      </div>
    </div>
    <div className="border-t border-border py-5 px-6">
      <p className="text-xs text-muted-foreground text-center">
        © {new Date().getFullYear()} VSM College of Engineering · College Genius Bot
      </p>
    </div>
  </footer>
);

export default Footer;
