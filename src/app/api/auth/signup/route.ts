import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

const signupSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(6).max(100),
  role: z.enum(["STUDENT", "ADMIN"]).optional().default("STUDENT"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = signupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const { name, email, password, role } = parsed.data;

    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await db.user.create({
      data: { name, email, passwordHash, role },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    return NextResponse.json({ message: "Account created successfully", user }, { status: 201 });
  } catch (error) {
    console.error("[SIGNUP]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
