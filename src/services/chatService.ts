import { SUPABASE_ANON_KEY } from "@/lib/supabase";

export type Msg = { role: "user" | "assistant"; content: string };

export const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;
export const SELF_INTRO_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/self-intro`;

const headers = {
  "Content-Type": "application/json",
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
};

/**
 * Streams a chat completion from the Supabase Edge Function.
 * `onDelta` receives the full assistant text so far.
 */
export async function streamChat(messages: Msg[], onDelta: (text: string) => void) {
  const resp = await fetch(CHAT_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ messages }),
  });

  if (!resp.ok || !resp.body) {
    const data = await resp.json().catch(() => ({}));
    throw new Error(data.error || "Failed to get a response from the assistant.");
  }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let full = "";
  let done = false;

  while (!done) {
    const { done: streamDone, value } = await reader.read();
    if (streamDone) break;
    buffer += decoder.decode(value, { stream: true });

    let nl: number;
    while ((nl = buffer.indexOf("\n")) !== -1) {
      let line = buffer.slice(0, nl);
      buffer = buffer.slice(nl + 1);
      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (line.startsWith(":") || line.trim() === "") continue;
      if (!line.startsWith("data: ")) continue;

      const jsonStr = line.slice(6).trim();
      if (jsonStr === "[DONE]") {
        done = true;
        break;
      }

      let parsed: any;
      try {
        parsed = JSON.parse(jsonStr);
      } catch {
        buffer = line + "\n" + buffer;
        break;
      }
      if (parsed.error) throw new Error(parsed.error);
      const content = parsed.choices?.[0]?.delta?.content as string | undefined;
      if (content) {
        full += content;
        onDelta(full);
      }
    }
  }

  return full;
}

export async function generateSelfIntro(answers: Record<string, string>) {
  const resp = await fetch(SELF_INTRO_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ answers }),
  });
  const data = await resp.json();
  if (!resp.ok) throw new Error(data.error || "Failed to generate the introduction.");
  return (data.intro as string).trim();
}
