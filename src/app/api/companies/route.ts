import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const createCompanySchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().optional(),
  logoUrl: z.string().url().optional().or(z.literal("")),
  websiteUrl: z.string().url().optional().or(z.literal("")),
  industry: z.string().optional(),
  companySize: z.string().optional(),
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("q") || "";
    
    const where: any = { isActive: true };
    if (search) {
      where.name = { contains: search, mode: "insensitive" };
    }

    const companies = await db.company.findMany({
      where,
      orderBy: { name: "asc" },
      include: {
        _count: { select: { opportunities: { where: { isActive: true } }, followedBy: true } }
      }
    });

    return NextResponse.json({ companies });
  } catch (error) {
    console.error("[COMPANIES_GET]", error);
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
    const parsed = createCompanySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const slug = `${parsed.data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`;

    const company = await db.company.create({
      data: { ...parsed.data, slug, isVerified: true },
    });

    return NextResponse.json({ company }, { status: 201 });
  } catch (error) {
    console.error("[COMPANIES_POST]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
