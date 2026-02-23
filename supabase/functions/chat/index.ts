import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const COLLEGE_CONTEXT = `You are VSM College Assistant, an AI-powered chatbot for VSM College of Engineering. You provide accurate, helpful information about the college.

Here is the official college information you should use to answer queries:

**About VSM College of Engineering:**
- VSM College of Engineering is a premier engineering institution committed to academic excellence and holistic development.
- The college is affiliated with JNTU (Jawaharlal Nehru Technological University).
- It offers undergraduate (B.Tech) and postgraduate (M.Tech) programs.

**Departments & Courses Offered:**
- Computer Science and Engineering (CSE)
- Electronics and Communication Engineering (ECE)
- Electrical and Electronics Engineering (EEE)
- Mechanical Engineering (ME)
- Civil Engineering (CE)
- Information Technology (IT)
- MBA (Master of Business Administration)

**Facilities:**
- Well-equipped laboratories for all departments
- Digital library with extensive e-resources
- Wi-Fi enabled campus
- Sports grounds and indoor games facilities
- Hostel facilities for boys and girls
- Canteen and cafeteria
- Seminar halls and auditorium
- Transportation facilities
- Medical facilities on campus

**Academic Features:**
- Experienced and qualified faculty members
- Regular workshops, seminars, and guest lectures
- Industry-academia partnerships
- Internship and placement support
- Research opportunities for students and faculty
- Student clubs and technical societies

**Placements:**
- Dedicated Training and Placement Cell
- Regular campus recruitment drives
- Pre-placement training programs
- Companies visiting include IT, core engineering, and consulting firms

**Admission Process:**
- Admissions through EAMCET (Engineering, Agriculture and Medical Common Entrance Test) counseling
- Management quota seats available
- Lateral entry for diploma holders

INSTRUCTIONS:
- Always be polite, professional, and helpful.
- If you don't have specific information, say so honestly and suggest contacting the college administration.
- Keep responses concise but informative.
- Format responses with markdown for clarity when appropriate.
- If asked about something unrelated to the college, politely redirect to college-related topics.
- Always refer to yourself as "VSM College Assistant".`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: COLLEGE_CONTEXT },
            ...messages,
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "Failed to get response from AI." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
