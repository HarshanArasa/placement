import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";
import { OpportunityType, WorkMode } from "@prisma/client";

const prefSchema = z.object({
  preferredOpportunityTypes: z.array(z.nativeEnum(OpportunityType)),
  preferredRoles: z.array(z.string()),
  preferredLocations: z.array(z.string()),
  preferredWorkModes: z.array(z.nativeEnum(WorkMode)),
  graduationYear: z.number().optional(),
  minimumSalary: z.number().optional(),
  minimumStipend: z.number().optional(),
  skillIds: z.array(z.string()).optional()
});

export async function GET(req: Request) {
  try {
    const session = await auth();
    const userId = (session?.user as any)?.id;
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const pref = await db.userPreference.findUnique({
      where: { userId },
      include: { skills: { include: { skill: true } } }
    });

    return NextResponse.json({ preference: pref });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth();
    const userId = (session?.user as any)?.id;
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parsed = prefSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Invalid data" }, { status: 400 });

    const { skillIds, ...data } = parsed.data;

    const pref = await db.userPreference.upsert({
      where: { userId },
      update: {
        ...data,
        ...(skillIds !== undefined ? {
          skills: { deleteMany: {}, create: skillIds.map((sid) => ({ skillId: sid })) }
        } : {})
      },
      create: {
        userId,
        ...data,
        ...(skillIds !== undefined ? {
          skills: { create: skillIds.map((sid) => ({ skillId: sid })) }
        } : {})
      },
      include: { skills: { include: { skill: true } } }
    });

    return NextResponse.json({ preference: pref });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
