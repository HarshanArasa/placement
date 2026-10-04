import { db } from "@/lib/db";
import Link from "next/link";
import { formatDate, getStatusColor, getStatusLabel, isDeadlineSoon } from "@/lib/utils";
import AppLayout from "@/components/layout/AppLayout";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SavedPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const savedList = await db.savedOpportunity.findMany({
    where: { userId: (session.user as any).id },
    orderBy: { createdAt: "desc" },
    include: {
      opportunity: { include: { company: true } }
    }
  });

  return (
    <AppLayout user={session.user}>
      <header style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "0.25rem", fontFamily: "Plus Jakarta Sans" }}>Saved Opportunities</h1>
        <p style={{ color: "#71717a" }}>Review and apply to opportunities you've bookmarked.</p>
      </header>

      <div className="opportunity-grid">
        {savedList.map(({ opportunity: opp }) => (
          <Link href={`/opportunities/${opp.id}`} key={opp.id} style={{ textDecoration: "none", color: "inherit" }}>
            <div className="opportunity-card" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                <div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.25rem", color: "#fafafa", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {opp.title}
                  </h3>
                  <p style={{ color: "#a1a1aa", fontSize: "0.9rem", fontWeight: 500 }}>{opp.company.name}</p>
                </div>
                {opp.company.logoUrl && (
                  <img src={opp.company.logoUrl} alt={opp.company.name} style={{ width: "40px", height: "40px", borderRadius: "8px", objectFit: "contain", background: "white", padding: "4px" }} />
                )}
              </div>

              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
                <span className={`badge ${opp.opportunityType === "INTERNSHIP" ? "badge-internship" : "badge-placement"}`}>{opp.opportunityType}</span>
                <span className={`badge ${getStatusColor(opp.status)}`}>{getStatusLabel(opp.status)}</span>
                {isDeadlineSoon(opp.deadline) && (
                  <span className="badge" style={{ background: "rgba(245,158,11,0.15)", color: "#fbbf24", borderColor: "rgba(245,158,11,0.3)" }}>
                    Closing Soon
                  </span>
                )}
              </div>

              <div style={{ marginTop: "auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", fontSize: "0.8rem", color: "#a1a1aa", background: "#18181b", padding: "1rem", borderRadius: "10px" }}>
                <div>
                  <div style={{ fontSize: "0.7rem", color: "#71717a", marginBottom: "0.1rem" }}>LOCATION</div>
                  <div style={{ color: "#e4e4e7", fontWeight: 500 }}>{opp.location || "Remote"}</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.7rem", color: "#71717a", marginBottom: "0.1rem" }}>DEADLINE</div>
                  <div style={{ color: "#e4e4e7", fontWeight: 500 }}>{formatDate(opp.deadline)}</div>
                </div>
              </div>
            </div>
          </Link>
        ))}
        {savedList.length === 0 && (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "4rem 2rem", background: "#111113", borderRadius: "16px", border: "1px dashed #27272a" }}>
            <p style={{ color: "#a1a1aa", marginBottom: "1rem" }}>You haven't saved any opportunities yet.</p>
            <Link href="/dashboard" className="btn-primary">Browse Opportunities</Link>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
