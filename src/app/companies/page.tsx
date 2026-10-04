import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { getStatusColor, getStatusLabel } from "@/lib/utils";

export default async function CompaniesPage() {
  const session = await auth();
  
  const companies = await db.company.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    include: {
      _count: { select: { opportunities: { where: { isActive: true } } } }
    }
  });

  return (
    <div className="animate-fade-in">
      <header style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "0.25rem", fontFamily: "Plus Jakarta Sans" }}>
          Companies
        </h1>
        <p style={{ color: "#71717a" }}>Discover companies hiring on OpportunityHub.</p>
      </header>

      <div className="opportunity-grid">
        {companies.map((company) => (
          <div key={company.id} className="opportunity-card" style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "1rem" }}>
              {company.logoUrl ? (
                <img src={company.logoUrl} alt={company.name} style={{ width: "48px", height: "48px", borderRadius: "12px", objectFit: "contain", background: "white", padding: "4px" }} />
              ) : (
                <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#27272a", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#a1a1aa" }}>
                  {company.name.charAt(0)}
                </div>
              )}
              <div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#fafafa" }}>{company.name}</h3>
                <p style={{ color: "#a1a1aa", fontSize: "0.85rem" }}>{company.industry || "Software & Tech"}</p>
              </div>
            </div>
            
            <p style={{ color: "#a1a1aa", fontSize: "0.9rem", marginBottom: "1.5rem", flex: 1, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
              {company.description || "No description provided."}
            </p>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "1rem", borderTop: "1px solid #27272a" }}>
              <span style={{ fontSize: "0.85rem", color: "#a1a1aa", fontWeight: 500 }}>
                {company._count.opportunities} Active Roles
              </span>
              <button className="btn-secondary" style={{ padding: "0.4rem 1rem", fontSize: "0.8rem" }}>Follow</button>
            </div>
          </div>
        ))}
        {companies.length === 0 && (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "4rem 2rem", background: "#111113", borderRadius: "16px", border: "1px dashed #27272a" }}>
            <p style={{ color: "#a1a1aa" }}>No companies found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
