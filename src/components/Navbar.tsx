import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GraduationCap, Menu, X, MessageCircle, Keyboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type NavItem = { label: string; hash?: string; to?: string; icon?: React.ElementType };

const NAV_ITEMS: NavItem[] = [
  { label: "Home", hash: "home" },
  { label: "About", hash: "about" },
  { label: "Departments", hash: "departments" },
  { label: "Courses", hash: "courses" },
  { label: "Admissions", hash: "admissions" },
  { label: "Placements", hash: "placements" },
  { label: "Events", hash: "events" },
  { label: "Contact", hash: "contact" },
  { label: "Practice", to: "/practice", icon: Keyboard },
  { label: "AI Assistant", to: "/chat", icon: MessageCircle },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goToSection = (hash: string) => {
    setOpen(false);
    if (pathname !== "/") {
      navigate(`/#${hash}`);
      return;
    }
    document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const linkClasses = (active: boolean) =>
    `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
      active
        ? "bg-primary text-primary-foreground"
        : "text-muted-foreground hover:text-foreground hover:bg-muted"
    }`;

  return (
    <nav
      className={`sticky top-0 z-50 border-b transition-all ${
        scrolled
          ? "border-border bg-card/80 backdrop-blur-xl shadow-sm"
          : "border-transparent bg-card/50 backdrop-blur-md"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
            <GraduationCap className="w-4.5 h-4.5 text-primary-foreground" />
          </div>
          <span className="font-bold text-foreground text-sm leading-tight">
            VSM College
            <span className="block text-[10px] font-medium text-muted-foreground">
              College Genius Bot
            </span>
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden lg:flex items-center gap-0.5">
          {NAV_ITEMS.map((item) =>
            item.to ? (
              <Link key={item.label} to={item.to} className={linkClasses(pathname === item.to)}>
                <span className="flex items-center gap-1.5">
                  {item.icon && <item.icon className="w-3.5 h-3.5" />}
                  {item.label}
                </span>
              </Link>
            ) : (
              <button
                key={item.label}
                onClick={() => goToSection(item.hash!)}
                className={linkClasses(false)}
              >
                {item.label}
              </button>
            )
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden p-2 text-muted-foreground hover:text-foreground"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden overflow-hidden border-t border-border bg-card"
          >
            <div className="px-4 py-3 space-y-1">
              {NAV_ITEMS.map((item) =>
                item.to ? (
                  <Link
                    key={item.label}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      {item.icon && <item.icon className="w-4 h-4" />}
                      {item.label}
                    </span>
                  </Link>
                ) : (
                  <button
                    key={item.label}
                    onClick={() => goToSection(item.hash!)}
                    className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    {item.label}
                  </button>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
