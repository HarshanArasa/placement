import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth();
    const userId = (session?.user as any)?.id;

    const company = await db.company.findUnique({
      where: { id },
      include: {
        opportunities: {
          where: { isActive: true },
          orderBy: { postedAt: "desc" },
          include: { source: true, skills: { include: { skill: true } } }
        },
        _count: { select: { followedBy: true } }
      }
    });

    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    let isFollowing = false;
    if (userId) {
      const followed = await db.followedCompany.findUnique({
        where: { userId_companyId: { userId, companyId: id } }
      });
      isFollowing = !!followed;
    }

    return NextResponse.json({ company, isFollowing });
  } catch (error) {
    console.error("[COMPANY_GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
