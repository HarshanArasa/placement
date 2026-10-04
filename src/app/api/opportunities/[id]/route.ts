import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth();
    const userId = (session?.user as any)?.id;

    const opportunity = await db.opportunity.findUnique({
      where: { id },
      include: {
        company: true,
        source: true,
        skills: { include: { skill: true } },
        _count: { select: { savedBy: true, applicationClicks: true } },
      },
    });

    if (!opportunity) {
      return NextResponse.json({ error: "Opportunity not found" }, { status: 404 });
    }

    await db.opportunity.update({ where: { id }, data: { viewCount: { increment: 1 } } });

    let isSaved = false;
    let isMarkedApplied = false;
    if (userId) {
      const [saved, marked] = await Promise.all([
        db.savedOpportunity.findUnique({ where: { userId_opportunityId: { userId, opportunityId: id } } }),
        db.markedApplication.findUnique({ where: { userId_opportunityId: { userId, opportunityId: id } } }),
      ]);
      isSaved = !!saved;
      isMarkedApplied = !!marked;
    }

    return NextResponse.json({ opportunity, isSaved, isMarkedApplied });
  } catch (error) {
    console.error("[OPPORTUNITY_GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const existing = await db.opportunity.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const { skillIds, deadline, postedAt, startDate, ...rest } = body;
    const opportunity = await db.opportunity.update({
      where: { id },
      data: {
        ...rest,
        ...(deadline ? { deadline: new Date(deadline) } : {}),
        ...(postedAt ? { postedAt: new Date(postedAt) } : {}),
        lastVerifiedAt: new Date(),
        ...(skillIds !== undefined ? {
          skills: { deleteMany: {}, create: skillIds.map((sid: string) => ({ skillId: sid })) },
        } : {}),
      },
      include: { company: true, source: true, skills: { include: { skill: true } } },
    });
    if (body.status && body.status !== existing.status) {
      await db.opportunityEvent.create({
        data: { opportunityId: id, eventType: "UPDATED", oldStatus: existing.status, newStatus: body.status },
      });
    }
    return NextResponse.json({ opportunity });
  } catch (error) {
    console.error("[OPPORTUNITY_PATCH]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await db.opportunity.update({
      where: { id },
      data: { isActive: false, status: "CLOSED", closedAt: new Date() },
    });
    return NextResponse.json({ message: "Opportunity closed" });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
