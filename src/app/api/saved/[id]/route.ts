import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: opportunityId } = await params;
    const session = await auth();
    const userId = (session?.user as any)?.id;
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await db.savedOpportunity.delete({
      where: { userId_opportunityId: { userId, opportunityId } }
    }).catch(() => {});

    return NextResponse.json({ message: "Removed from saved" });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
