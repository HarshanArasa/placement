import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";

const verifySchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["STUDENT", "ADMIN"]).default("STUDENT"),
  otp: z.string().length(6),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = verifySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const { name, email, password, role, otp } = parsed.data;

    // Check OTP
    const record = await db.verificationToken.findFirst({
      where: { identifier: email, token: otp },
    });

    if (!record) {
      return NextResponse.json({ error: "Invalid OTP code" }, { status: 400 });
    }

    if (record.expires < new Date()) {
      return NextResponse.json({ error: "OTP code has expired" }, { status: 400 });
    }

    // OTP valid, create user
    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await db.user.create({
      data: { name, email, passwordHash, role },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    // Delete OTP
    await db.verificationToken.delete({ where: { identifier_token: { identifier: email, token: otp } } });

    return NextResponse.json({ message: "Account created successfully", user }, { status: 201 });
  } catch (error) {
    console.error("[VERIFY_OTP]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
