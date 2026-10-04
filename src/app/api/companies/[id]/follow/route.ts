import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth();
    const userId = (session?.user as any)?.id;
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await db.followedCompany.upsert({
      where: { userId_companyId: { userId, companyId: id } },
      update: {},
      create: { userId, companyId: id }
    });

    return NextResponse.json({ message: "Company followed" });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth();
    const userId = (session?.user as any)?.id;
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await db.followedCompany.delete({
      where: { userId_companyId: { userId, companyId: id } }
    }).catch(() => {});

    return NextResponse.json({ message: "Company unfollowed" });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
