import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";
import { OpportunityStatus, OpportunityType, WorkMode } from "@prisma/client";

const createOpportunitySchema = z.object({
  title: z.string().min(2).max(200),
  companyId: z.string(),
  sourceId: z.string(),
  opportunityType: z.nativeEnum(OpportunityType),
  description: z.string().optional(),
  responsibilities: z.string().optional(),
  eligibility: z.string().optional(),
  branchEligibility: z.string().optional(),
  location: z.string().optional(),
  workMode: z.nativeEnum(WorkMode).optional(),
  salaryMin: z.number().optional(),
  salaryMax: z.number().optional(),
  stipendMin: z.number().optional(),
  stipendMax: z.number().optional(),
  duration: z.string().optional(),
  graduationYear: z.number().optional(),
  deadline: z.string().optional(),
  postedAt: z.string().optional(),
  sourceUrl: z.string().url(),
  status: z.nativeEnum(OpportunityStatus).optional(),
  skillIds: z.array(z.string()).optional(),
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") as OpportunityType | null;
    const status = searchParams.get("status") as OpportunityStatus | null;
    const search = searchParams.get("q") || "";
    const location = searchParams.get("location") || "";
    const workMode = searchParams.get("workMode") as WorkMode | null;
    const companyId = searchParams.get("companyId") || "";
    const graduationYear = searchParams.get("graduationYear");
    const sort = searchParams.get("sort") || "newest";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50);
    const skip = (page - 1) * limit;

    const where: any = { isActive: true };
    if (type) where.opportunityType = type;
    if (status) where.status = status;
    else where.status = { not: "EXPIRED" };
    if (location) where.location = { contains: location, mode: "insensitive" };
    if (workMode) where.workMode = workMode;
    if (companyId) where.companyId = companyId;
    if (graduationYear) where.graduationYear = parseInt(graduationYear);
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { location: { contains: search, mode: "insensitive" } },
        { company: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    const orderBy: any = 
      sort === "oldest" ? { postedAt: "asc" } :
      sort === "deadline" ? { deadline: "asc" } :
      sort === "salary_high" ? { salaryMax: "desc" } :
      sort === "stipend_high" ? { stipendMax: "desc" } :
      sort === "company" ? { company: { name: "asc" } } :
      { postedAt: "desc" };

    const [opportunities, total] = await Promise.all([
      db.opportunity.findMany({
        where,
        include: {
          company: { select: { id: true, name: true, logoUrl: true, slug: true } },
          source: { select: { id: true, name: true, type: true } },
          skills: { include: { skill: true } },
          _count: { select: { savedBy: true, applicationClicks: true } },
        },
        orderBy,
        skip,
        take: limit,
      }),
      db.opportunity.count({ where }),
    ]);

    return NextResponse.json({
      opportunities,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("[OPPORTUNITIES_GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = createOpportunitySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const { skillIds, deadline, postedAt, ...data } = parsed.data;

    const slug = `${data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`;

    const opportunity = await db.opportunity.create({
      data: {
        ...data,
        slug,
        deadline: deadline ? new Date(deadline) : undefined,
        postedAt: postedAt ? new Date(postedAt) : new Date(),
        status: data.status || "ACTIVE",
        ...(skillIds && skillIds.length > 0 ? {
          skills: {
            create: skillIds.map((skillId) => ({ skillId })),
          },
        } : {}),
      },
      include: {
        company: true,
        source: true,
        skills: { include: { skill: true } },
      },
    });

    await db.opportunityEvent.create({
      data: {
        opportunityId: opportunity.id,
        eventType: "CREATED",
        newStatus: opportunity.status,
      },
    });

    return NextResponse.json({ opportunity }, { status: 201 });
  } catch (error) {
    console.error("[OPPORTUNITIES_POST]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
