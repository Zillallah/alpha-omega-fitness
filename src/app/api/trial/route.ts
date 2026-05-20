import { NextResponse } from "next/server";

type TrialSubmission = {
  name: string;
  email: string;
  phone: string;
  goal?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as TrialSubmission;

    if (!body.name?.trim() || !body.email?.trim() || !body.phone?.trim()) {
      return NextResponse.json(
        { error: "Name, email, and phone are required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: "Please enter a valid email." },
        { status: 400 }
      );
    }

    console.log("[TRIAL_SUBMISSION]", {
      timestamp: new Date().toISOString(),
      name: body.name,
      email: body.email,
      phone: body.phone,
      goal: body.goal?.slice(0, 200) || "(none)",
    });

    // Optional Supabase insert — only fires if both env vars are set
    if (
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY
    ) {
      try {
        const supabaseRes = await fetch(
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/trial_requests`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
              Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
              Prefer: "return=minimal",
            },
            body: JSON.stringify({
              name: body.name,
              email: body.email,
              phone: body.phone,
              goal: body.goal || null,
              status: "pending",
            }),
          }
        );
        if (!supabaseRes.ok) {
          console.error("[SUPABASE_ERROR]", await supabaseRes.text());
        }
      } catch (err) {
        console.error("[SUPABASE_FETCH_ERROR]", err);
      }
    }

    // Optional Resend notification — only fires if both env vars are set
    if (process.env.RESEND_API_KEY && process.env.OPERATOR_EMAIL) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: "Alpha Omega Trials <trial@aofithd.com>",
            to: process.env.OPERATOR_EMAIL,
            subject: `New 5-day trial request — ${body.name}`,
            text: `New trial request received.\n\nName: ${body.name}\nEmail: ${body.email}\nPhone: ${body.phone}\nGoal: ${body.goal || "(none provided)"}\n\nReach out within 24 hours.`,
          }),
        });
      } catch (err) {
        console.error("[RESEND_ERROR]", err);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[API_TRIAL_ERROR]", err);
    return NextResponse.json(
      { error: "Server error processing submission." },
      { status: 500 }
    );
  }
}
