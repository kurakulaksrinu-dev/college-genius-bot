import { GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";
import ChatInterface from "@/components/ChatInterface";

const Chat = () => {
  return (
    <div className="h-screen flex flex-col bg-background">
      <header className="border-b border-border bg-card px-4 py-3 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
          <GraduationCap className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-foreground leading-tight">VSM College Assistant</h1>
          <p className="text-xs text-muted-foreground">AI-Powered College Information</p>
        </div>
        <Link
          to="/"
          className="ml-auto text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back to Home
        </Link>
      </header>
      <ChatInterface />
    </div>
  );
};

export default Chat;
