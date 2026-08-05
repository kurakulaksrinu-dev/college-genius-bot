import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, Keyboard, RotateCcw, Copy, Check, Sparkle, Eye, EyeOff } from "lucide-react";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";

type Step = {
  key: string;
  question: string;
  placeholder: string;
};

const STEPS: Step[] = [
  { key: "Name", question: "Great — let's begin! What is your full name?", placeholder: "My name is ..." },
  { key: "Hometown", question: "Nice to meet you. Where are you from?", placeholder: "I am from ..." },
  { key: "Academic qualification", question: "What is your academic qualification? (course, branch, year, college, marks)", placeholder: "I am pursuing B.Tech in ..." },
  { key: "Skills", question: "Which technical and soft skills do you have?", placeholder: "Java, Python, communication ..." },
  { key: "Continuous professional development", question: "What courses, certifications or workshops have you completed recently?", placeholder: "NPTEL course on ..., AWS certification ..." },
  { key: "Hobbies", question: "What are your hobbies?", placeholder: "Reading, cricket, music ..." },
  { key: "Interests", question: "Which areas or subjects interest you the most?", placeholder: "Web development, AI ..." },
  { key: "Motivation", question: "What motivates you to keep working hard?", placeholder: "I am motivated by ..." },
  { key: "Goals", question: "What are your short-term and long-term goals?", placeholder: "In the next two years I want to ..." },
  { key: "Strengths", question: "What are your key strengths?", placeholder: "Quick learner, disciplined ..." },
  { key: "Family", question: "Finally, tell me a little about your family.", placeholder: "My family consists of ..." },
];

const INTRO_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/self-intro`;

type Bubble = { role: "ai" | "student"; text: string };

const Practice = () => {
  const [stage, setStage] = useState<"interview" | "loading" | "typing">("interview");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [bubbles, setBubbles] = useState<Bubble[]>([{ role: "ai", text: STEPS[0].question }]);
  const [input, setInput] = useState("");
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [answerChars, setAnswerChars] = useState(0);
  const [answerSeconds, setAnswerSeconds] = useState(0);

  const [intro, setIntro] = useState("");
  const [typed, setTyped] = useState("");
  const [typingStart, setTypingStart] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [copied, setCopied] = useState(false);
  const [hideIntro, setHideIntro] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const typingRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [bubbles, stage]);

  useEffect(() => {
    if (stage === "interview") inputRef.current?.focus();
    if (stage === "typing") typingRef.current?.focus();
  }, [stage, index]);

  // live timer for the typing test
  useEffect(() => {
    if (stage !== "typing" || typingStart === null || typed.length >= intro.length) return;
    const id = setInterval(() => setElapsed((Date.now() - typingStart) / 1000), 200);
    return () => clearInterval(id);
  }, [stage, typingStart, typed, intro]);

  const interviewWpm = answerSeconds > 0 ? Math.round(answerChars / 5 / (answerSeconds / 60)) : 0;

  const typingStats = useMemo(() => {
    const chars = typed.length;
    let correct = 0;
    for (let i = 0; i < chars; i++) if (typed[i] === intro[i]) correct++;
    const minutes = Math.max(elapsed, 1) / 60;
    return {
      wpm: chars > 0 ? Math.round(chars / 5 / minutes) : 0,
      accuracy: chars > 0 ? Math.round((correct / chars) * 100) : 100,
      progress: intro.length ? Math.min(100, Math.round((chars / intro.length) * 100)) : 0,
      done: chars >= intro.length && intro.length > 0,
    };
  }, [typed, intro, elapsed]);

  const submitAnswer = async () => {
    const text = input.trim();
    if (!text) return;

    const step = STEPS[index];
    const seconds = startedAt ? (Date.now() - startedAt) / 1000 : 0;
    setAnswerChars((c) => c + text.length);
    setAnswerSeconds((s) => s + seconds);
    setStartedAt(null);

    const nextAnswers = { ...answers, [step.key]: text };
    setAnswers(nextAnswers);
    setInput("");

    const next = index + 1;
    if (next < STEPS.length) {
      setBubbles((b) => [...b, { role: "student", text }, { role: "ai", text: STEPS[next].question }]);
      setIndex(next);
      return;
    }

    setBubbles((b) => [
      ...b,
      { role: "student", text },
      { role: "ai", text: "Thank you! Preparing your self-introduction..." },
    ]);
    setStage("loading");

    try {
      const resp = await fetch(INTRO_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ answers: nextAnswers }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || "Failed to generate");
      setIntro((data.intro as string).trim());
      setStage("typing");
    } catch (e) {
      console.error(e);
      toast.error(e instanceof Error ? e.message : "Something went wrong. Please try again.");
      setStage("interview");
    }
  };

  const restart = () => {
    setStage("interview");
    setIndex(0);
    setAnswers({});
    setBubbles([{ role: "ai", text: STEPS[0].question }]);
    setInput("");
    setStartedAt(null);
    setAnswerChars(0);
    setAnswerSeconds(0);
    setIntro("");
    setTyped("");
    setTypingStart(null);
    setElapsed(0);
  };

  const copyIntro = async () => {
    await navigator.clipboard.writeText(intro);
    setCopied(true);
    toast.success("Self-introduction copied");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Typing & Self-Introduction Practice</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Answer a few questions by typing, then practise typing the self-introduction the assistant
            writes for you. You build typing speed and interview confidence at the same time.
          </p>
        </header>

        {stage !== "typing" && (
          <section className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <span className="text-xs font-medium text-muted-foreground">
                Question {Math.min(index + 1, STEPS.length)} of {STEPS.length}
              </span>
              <span className="text-xs text-muted-foreground">Typing speed: {interviewWpm} WPM</span>
            </div>
            <div className="h-1 bg-muted">
              <div
                className="h-full gradient-primary transition-all"
                style={{ width: `${(index / STEPS.length) * 100}%` }}
              />
            </div>

            <div ref={scrollRef} className="max-h-[45vh] overflow-y-auto p-4 space-y-3">
              <AnimatePresence initial={false}>
                {bubbles.map((b, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={b.role === "student" ? "flex justify-end" : "flex justify-start"}
                  >
                    <div
                      className={
                        b.role === "student"
                          ? "max-w-[80%] rounded-2xl bg-primary text-primary-foreground px-4 py-2 text-sm whitespace-pre-wrap"
                          : "max-w-[85%] text-sm text-foreground whitespace-pre-wrap"
                      }
                    >
                      {b.text}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {stage === "loading" && (
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Loader2 className="w-4 h-4 animate-spin" /> Writing your self-introduction...
                </div>
              )}
            </div>

            <div className="border-t border-border p-3">
              <div className="flex items-end gap-2 bg-muted rounded-2xl p-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  disabled={stage === "loading"}
                  onChange={(e) => {
                    if (startedAt === null && e.target.value.length > 0) setStartedAt(Date.now());
                    setInput(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      submitAnswer();
                    }
                  }}
                  rows={1}
                  placeholder={STEPS[Math.min(index, STEPS.length - 1)].placeholder}
                  className="flex-1 bg-transparent resize-none border-0 outline-none text-foreground placeholder:text-muted-foreground px-3 py-2 text-sm max-h-32"
                  style={{ minHeight: "40px" }}
                />
                <button
                  onClick={submitAnswer}
                  disabled={!input.trim() || stage === "loading"}
                  className="shrink-0 w-9 h-9 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground disabled:opacity-40"
                >
                  {stage === "loading" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-xs text-muted-foreground text-center mt-2">
                Type your answer in full sentences — Enter to send, Shift+Enter for a new line.
              </p>
            </div>
          </section>
        )}

        {stage === "typing" && (
          <section className="space-y-4">
            <div className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkle className="w-4 h-4 text-primary" />
                <h2 className="text-sm font-semibold text-foreground">Your self-introduction</h2>
                <button
                  onClick={copyIntro}
                  className="ml-auto text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  Copy
                </button>
              </div>
              <p className="text-sm leading-relaxed font-mono">
                {intro.split("").map((ch, i) => {
                  const state =
                    i >= typed.length ? "pending" : typed[i] === ch ? "correct" : "wrong";
                  return (
                    <span
                      key={i}
                      className={
                        state === "correct"
                          ? "text-foreground"
                          : state === "wrong"
                            ? "bg-destructive/20 text-destructive"
                            : "text-muted-foreground"
                      }
                    >
                      {ch}
                    </span>
                  );
                })}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Speed", value: `${typingStats.wpm} WPM` },
                { label: "Accuracy", value: `${typingStats.accuracy}%` },
                { label: "Progress", value: `${typingStats.progress}%` },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-border bg-card p-3 text-center">
                  <p className="text-lg font-bold text-foreground">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <Keyboard className="w-4 h-4 text-primary" />
                <h2 className="text-sm font-semibold text-foreground">Type it out to practise</h2>
              </div>
              <textarea
                ref={typingRef}
                value={typed}
                onChange={(e) => {
                  if (typingStart === null) setTypingStart(Date.now());
                  setTyped(e.target.value.slice(0, intro.length));
                }}
                placeholder="Start typing the introduction above..."
                className="w-full h-40 resize-none rounded-xl bg-muted p-3 text-sm font-mono text-foreground placeholder:text-muted-foreground outline-none"
              />
              {typingStats.done && (
                <p className="mt-3 text-sm text-foreground">
                  Well done! You typed the full introduction at{" "}
                  <strong>{typingStats.wpm} WPM</strong> with{" "}
                  <strong>{typingStats.accuracy}% accuracy</strong>. Now read it aloud a few times.
                </p>
              )}
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => {
                    setTyped("");
                    setTypingStart(null);
                    setElapsed(0);
                    typingRef.current?.focus();
                  }}
                  className="text-xs px-3 py-2 rounded-lg border border-border text-muted-foreground hover:text-foreground"
                >
                  Retry typing
                </button>
                <button
                  onClick={restart}
                  className="text-xs px-3 py-2 rounded-lg border border-border text-muted-foreground hover:text-foreground flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Start over
                </button>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Practice;
