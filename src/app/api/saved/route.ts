import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const session = await auth();
    const userId = (session?.user as any)?.id;
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const saved = await db.savedOpportunity.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        opportunity: {
          include: { company: true, source: true, skills: { include: { skill: true } } }
        }
      }
    });

    return NextResponse.json({ saved: saved.map(s => s.opportunity) });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    const userId = (session?.user as any)?.id;
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { opportunityId } = await req.json();
    if (!opportunityId) return NextResponse.json({ error: "Missing opportunityId" }, { status: 400 });

    await db.savedOpportunity.upsert({
      where: { userId_opportunityId: { userId, opportunityId } },
      update: {},
      create: { userId, opportunityId }
    });

    return NextResponse.json({ message: "Saved successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
