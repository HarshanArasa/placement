import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminOpportunitiesPage() {
  const session = await auth();
  
  if (!session || (session.user as any).role !== "ADMIN") {
    redirect("/dashboard");
  }

  // Fetch opportunities with their companies
  const opportunities = await db.opportunity.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      company: true,
    }
  });

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto", color: "white" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "bold" }}>Manage Opportunities</h1>
          <p style={{ color: "#a1a1aa" }}>View and manage all active placements and internships.</p>
        </div>
        <Link 
          href="/admin/opportunities/new" 
          style={{ 
            background: "linear-gradient(135deg, #6d28d9, #06b6d4)", 
            color: "white", padding: "0.75rem 1.5rem", borderRadius: "8px", 
            textDecoration: "none", fontWeight: "bold", display: "inline-block"
          }}>
          + Post New Opportunity
        </Link>
      </div>

      <div style={{ background: "#111113", border: "1px solid #27272a", borderRadius: "12px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ background: "#18181b", borderBottom: "1px solid #27272a" }}>
              <th style={{ padding: "1rem", color: "#a1a1aa", fontWeight: 600, fontSize: "0.9rem" }}>Title</th>
              <th style={{ padding: "1rem", color: "#a1a1aa", fontWeight: 600, fontSize: "0.9rem" }}>Company</th>
              <th style={{ padding: "1rem", color: "#a1a1aa", fontWeight: 600, fontSize: "0.9rem" }}>Type</th>
              <th style={{ padding: "1rem", color: "#a1a1aa", fontWeight: 600, fontSize: "0.9rem" }}>Status</th>
              <th style={{ padding: "1rem", color: "#a1a1aa", fontWeight: 600, fontSize: "0.9rem" }}>Deadline</th>
            </tr>
          </thead>
          <tbody>
            {opportunities.map(opp => (
              <tr key={opp.id} style={{ borderBottom: "1px solid #27272a" }}>
                <td style={{ padding: "1rem", fontWeight: 500 }}>{opp.title}</td>
                <td style={{ padding: "1rem" }}>{opp.company.name}</td>
                <td style={{ padding: "1rem" }}>
                  <span style={{ 
                    background: "#27272a", padding: "0.25rem 0.5rem", borderRadius: "4px", fontSize: "0.8rem", color: "#e4e4e7"
                  }}>
                    {opp.opportunityType}
                  </span>
                </td>
                <td style={{ padding: "1rem" }}>
                  <span style={{ 
                    background: opp.status === "ACTIVE" ? "rgba(52,211,153,0.1)" : "rgba(248,113,113,0.1)", 
                    color: opp.status === "ACTIVE" ? "#34d399" : "#f87171",
                    padding: "0.25rem 0.5rem", borderRadius: "4px", fontSize: "0.8rem", fontWeight: 600
                  }}>
                    {opp.status}
                  </span>
                </td>
                <td style={{ padding: "1rem", color: "#a1a1aa", fontSize: "0.9rem" }}>
                  {opp.deadline ? new Date(opp.deadline).toLocaleDateString() : "No deadline"}
                </td>
              </tr>
            ))}
            {opportunities.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: "2rem", textAlign: "center", color: "#a1a1aa" }}>
                  No opportunities posted yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
