import { NextResponse } from "next/server";
import * as nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { email, testMessage } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    console.log("Testing email with:");
    console.log("- User:", process.env.EMAIL_APP_PASSWORD ? "✓ Set" : "✗ Missing");
    console.log("- To:", email);
    console.log("- Pass length:", process.env.EMAIL_APP_PASSWORD?.length || 0);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "radheyradhey15.jodhpur@gmail.com",
        pass: process.env.EMAIL_APP_PASSWORD
      }
    });

    // Verify transporter connection
    await transporter.verify();
    console.log("✓ Transporter verified successfully");

    const result = await transporter.sendMail({
      from: "proton.cybsec@nmamit.in",
      to: email,
      subject: "🧪 CTF Test Email",
      text: testMessage || "This is a test email from your CTF platform. If you received this, email sending is working correctly!",
      html: `<h2>CTF Test Email</h2><p>${testMessage || "This is a test email from your CTF platform. If you received this, email sending is working correctly!"}</p>`,
    });

    console.log("✓ Email sent:", result.response);

    return NextResponse.json({ 
      ok: true, 
      message: "Test email sent successfully",
      messageId: result.messageId 
    });
  } catch (err) {
    console.error("Email error:", err);
    return NextResponse.json({ 
      error: "Email failed",
      details: err instanceof Error ? err.message : String(err)
    }, { status: 500 });
  }
}
