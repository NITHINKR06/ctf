import { NextResponse } from "next/server";
import * as nodemailer from "nodemailer";
import { collection, getDocs, query, where, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function POST(req: Request) {
  try {
    const { emails, challenges } = await req.json();

    if (!emails || emails.length === 0) {
      return NextResponse.json({ error: "No emails provided" }, { status: 400 });
    }

    if (!challenges || challenges.length === 0) {
      return NextResponse.json({ error: "No challenges provided" }, { status: 400 });
    }

    console.log("Sending digest email for challenges:", challenges.map((c: any) => c.title));
    console.log("- Recipients count:", emails.length);
    console.log("- Challenges count:", challenges.length);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "proton.cybsec@gmail.com",
        pass: process.env.EMAIL_APP_PASSWORD
      }
    });

    // Verify transporter connection
    await transporter.verify();
    console.log("✓ Transporter verified successfully");

    // Build challenge list HTML
    const challengesList = challenges
      .map((c: any) => `
        <tr style="border-bottom: 1px solid #ddd; padding: 10px;">
          <td style="padding: 8px; font-weight: bold; color: #333;">${c.title}</td>
          <td style="padding: 8px; color: #666;">${c.category}</td>
          <td style="padding: 8px; color: #2563eb; font-weight: bold;">${c.points} pts</td>
        </tr>
      `)
      .join("");

    const challengesTextList = challenges
      .map((c: any) => `- ${c.title} (${c.category}) - ${c.points} pts`)
      .join("\n");

    for (const email of emails) {
      const result = await transporter.sendMail({
        from: "proton.cybsec@nmamit.in",
        to: email,
        subject: `🔥 ${challenges.length} New CTF Challenge${challenges.length > 1 ? 's' : ''} Added!`,
        text: `New CTF Challenges Added to PROTON CTF!!!\n\n${challengesTextList}\n\nHurry up and solve them: https://ctf.protonnmamit.com`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #ff6b35; text-align: center;">🔥 ${challenges.length} New Challenge${challenges.length > 1 ? 's' : ''} Added!</h2>
            
            <p style="color: #333; font-size: 16px;">
              Check out the fresh challenges added to PROTON CTF:
            </p>
            
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background: #f9fafb;">
              <thead>
                <tr style="background: #2563eb; color: white;">
                  <th style="padding: 12px; text-align: left;">Challenge</th>
                  <th style="padding: 12px; text-align: left;">Category</th>
                  <th style="padding: 12px; text-align: center;">Points</th>
                </tr>
              </thead>
              <tbody>
                ${challengesList}
              </tbody>
            </table>

            <br>
            <p style="color: #333; font-size: 16px;">
               Think you're quick?<br>
               Think you're sharp?<br>
               Then prove it — Someone’s going to hit first blood — better not be someone else...
            </p>
            
            <p style="color: #666; text-align: center; margin: 20px 0;">
              <a href="https://ctf.protonnmamit.com" style="background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Solve Now
              </a>
            </p>
            
            <p style="color: #999; font-size: 12px; text-align: center; margin-top: 30px;">
              Don't miss out on points and glory!
            </p>
          </div>
        `,
      });
      console.log(`✓ Email sent to ${email}:`, result.messageId);
    }

    console.log("✓ All digest emails sent successfully");
    return NextResponse.json({ ok: true, sent: emails.length, challengeCount: challenges.length });
  } catch (err) {
    console.error("Email error:", err);
    return NextResponse.json(
      {
        error: "Email failed",
        details: err instanceof Error ? err.message : String(err)
      },
      { status: 500 }
    );
  }
}
