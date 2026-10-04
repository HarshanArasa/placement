import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, companyName, opportunityType, location, deadline, sourceUrl, description } = body;

    if (!title || !companyName || !opportunityType || !deadline || !sourceUrl) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Find or create the company
    let company = await db.company.findFirst({
      where: { name: { equals: companyName, mode: "insensitive" } }
    });

    if (!company) {
      const slug = companyName.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now();
      company = await db.company.create({
        data: { name: companyName, slug, isVerified: true, isActive: true },
      });
    }

    // 2. Find or create a default Admin Source
    let source = await db.source.findFirst({
      where: { type: "ADMIN" }
    });

    if (!source) {
      source = await db.source.create({
        data: { name: "Admin Portal", slug: "admin-portal", type: "ADMIN", isActive: true },
      });
    }

    // 3. Create the opportunity
    const oppSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now();
    const deadlineDate = new Date(deadline);

    const opportunity = await db.opportunity.create({
      data: {
        title,
        slug: oppSlug,
        opportunityType, // INTERNSHIP, PLACEMENT, or BOTH
        location,
        description,
        sourceUrl,
        deadline: deadlineDate,
        status: "ACTIVE", // Start as active
        companyId: company.id,
        sourceId: source.id,
      },
    });

    return NextResponse.json({ message: "Opportunity created successfully", opportunity }, { status: 201 });
  } catch (error) {
    console.error("[ADMIN_OPPORTUNITY_CREATE]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
