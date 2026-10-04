import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { formatDate, getStatusColor, getStatusLabel, formatSalary, formatStipend, isDeadlineSoon, isDeadlinePassed } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await auth();
  const userName = session?.user?.name || "User";

  // Fetch some sample data for the dashboard
  const activeOpportunities = await db.opportunity.findMany({
    where: { isActive: true, status: { in: ["ACTIVE", "CLOSING_SOON"] } },
    orderBy: { createdAt: "desc" },
    take: 6,
    include: { company: true }
  });

  const savedCount = await db.savedOpportunity.count({ where: { userId: (session?.user as any)?.id || "" } });

  return (
    <div className="animate-fade-in">
      <header style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "0.25rem", fontFamily: "Plus Jakarta Sans" }}>
          Hello, {userName} 👋
        </h1>
        <p style={{ color: "#71717a" }}>Here is what's happening with your opportunities today.</p>
      </header>

      {/* Quick Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem", marginBottom: "3rem" }}>
        <div className="card">
          <div style={{ fontSize: "0.875rem", color: "#a1a1aa", fontWeight: 600, marginBottom: "0.5rem" }}>Saved Opportunities</div>
          <div style={{ fontSize: "2rem", fontWeight: 700, color: "#a78bfa" }}>{savedCount}</div>
        </div>
        <div className="card">
          <div style={{ fontSize: "0.875rem", color: "#a1a1aa", fontWeight: 600, marginBottom: "0.5rem" }}>Active Internships</div>
          <div style={{ fontSize: "2rem", fontWeight: 700, color: "#22d3ee" }}>{activeOpportunities.filter(o => o.opportunityType !== "PLACEMENT").length}+</div>
        </div>
        <div className="card">
          <div style={{ fontSize: "0.875rem", color: "#a1a1aa", fontWeight: 600, marginBottom: "0.5rem" }}>Active Placements</div>
          <div style={{ fontSize: "2rem", fontWeight: 700, color: "#a78bfa" }}>{activeOpportunities.filter(o => o.opportunityType !== "INTERNSHIP").length}+</div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, fontFamily: "Plus Jakarta Sans" }}>Recent Opportunities</h2>
        <div style={{ display: "flex", gap: "1rem" }}>
          <Link href="/internships" className="btn-secondary" style={{ padding: "0.4rem 1rem", fontSize: "0.8rem" }}>View Internships</Link>
          <Link href="/placements" className="btn-secondary" style={{ padding: "0.4rem 1rem", fontSize: "0.8rem" }}>View Placements</Link>
        </div>
      </div>

      <div className="opportunity-grid">
        {activeOpportunities.map((opp) => (
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
                {opp.opportunityType === "INTERNSHIP" || opp.opportunityType === "BOTH" ? (
                  <span className="badge badge-internship">Internship</span>
                ) : null}
                {opp.opportunityType === "PLACEMENT" || opp.opportunityType === "BOTH" ? (
                  <span className="badge badge-placement">Placement</span>
                ) : null}
                <span className={`badge ${getStatusColor(opp.status)}`}>
                  {getStatusLabel(opp.status)}
                </span>
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
                  <div style={{ fontSize: "0.7rem", color: "#71717a", marginBottom: "0.1rem" }}>PAYOUT</div>
                  <div style={{ color: "#e4e4e7", fontWeight: 500 }}>
                    {opp.opportunityType === "INTERNSHIP" 
                      ? formatStipend(opp.stipendMin, opp.stipendMax, opp.stipendCurrency)
                      : formatSalary(opp.salaryMin, opp.salaryMax, opp.salaryCurrency)}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "0.7rem", color: "#71717a", marginBottom: "0.1rem" }}>DEADLINE</div>
                  <div style={{ color: isDeadlinePassed(opp.deadline) ? "#ef4444" : "#e4e4e7", fontWeight: 500 }}>
                    {formatDate(opp.deadline)}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "0.7rem", color: "#71717a", marginBottom: "0.1rem" }}>POSTED</div>
                  <div style={{ color: "#e4e4e7", fontWeight: 500 }}>{formatDate(opp.postedAt)}</div>
                </div>
              </div>
            </div>
          </Link>
        ))}

        {activeOpportunities.length === 0 && (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "4rem 2rem", background: "#111113", borderRadius: "16px", border: "1px dashed #27272a" }}>
            <p style={{ color: "#a1a1aa", marginBottom: "1rem" }}>No active opportunities found in the database.</p>
          </div>
        )}
      </div>
    </div>
  );
}
