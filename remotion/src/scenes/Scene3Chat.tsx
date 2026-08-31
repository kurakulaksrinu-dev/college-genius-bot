import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Bubble, ChatWindow } from "../components/ChatMock";

const messages: { role: "user" | "bot"; text: string; from: number }[] = [
  { role: "user", from: 6, text: "What are the B.Tech courses offered at VSM?" },
  {
    role: "bot",
    from: 90,
    text: "VSM College of Engineering offers B.Tech in CSE (including AI & ML and Data Science),\nIT, ECE, EEE, Mechanical and Civil Engineering.",
  },
  { role: "user", from: 250, text: "What is Thursday's timetable for III CSE-A?" },
  {
    role: "bot",
    from: 330,
    text: "III CSE-A meets in its allotted room with six periods on Thursday,\nincluding theory sessions and a lab slot with the assigned faculty.",
  },
];

export const Scene3Chat: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <ChatWindow>
        {messages.map((m) =>
          frame >= m.from ? <Bubble key={m.from} role={m.role} from={m.from} text={m.text} typed /> : null
        )}
      </ChatWindow>
    </AbsoluteFill>
  );
};
