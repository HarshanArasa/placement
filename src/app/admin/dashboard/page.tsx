import Link from "next/link";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  const session = await auth();
  
  if (!session || (session.user as any).role !== "ADMIN") {
    redirect("/dashboard");
  }

  // Fetch some stats from DB
  const opportunitiesCount = await db.opportunity.count();
  const activeOpportunities = await db.opportunity.count({ where: { status: "ACTIVE" } });
  const companiesCount = await db.company.count();
  const usersCount = await db.user.count();

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto", color: "white" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "bold" }}>Admin Dashboard</h1>
          <p style={{ color: "#a1a1aa" }}>Manage opportunities, users, and platform settings.</p>
        </div>
        <Link 
          href="/admin/opportunities/new" 
          style={{ 
            background: "linear-gradient(135deg, #6d28d9, #06b6d4)", 
            color: "white", padding: "0.75rem 1.5rem", borderRadius: "8px", 
            textDecoration: "none", fontWeight: "bold",
            display: "inline-block"
          }}>
          + Post New Opportunity
        </Link>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
        
        {/* Stat Cards */}
        <div style={{ background: "#111113", border: "1px solid #27272a", padding: "1.5rem", borderRadius: "12px" }}>
          <h3 style={{ color: "#a1a1aa", fontSize: "0.9rem", marginBottom: "0.5rem" }}>Total Opportunities</h3>
          <p style={{ fontSize: "2.5rem", fontWeight: "bold", color: "white" }}>{opportunitiesCount}</p>
        </div>

        <div style={{ background: "#111113", border: "1px solid #27272a", padding: "1.5rem", borderRadius: "12px" }}>
          <h3 style={{ color: "#a1a1aa", fontSize: "0.9rem", marginBottom: "0.5rem" }}>Active Opportunities</h3>
          <p style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#34d399" }}>{activeOpportunities}</p>
        </div>

        <div style={{ background: "#111113", border: "1px solid #27272a", padding: "1.5rem", borderRadius: "12px" }}>
          <h3 style={{ color: "#a1a1aa", fontSize: "0.9rem", marginBottom: "0.5rem" }}>Total Companies</h3>
          <p style={{ fontSize: "2.5rem", fontWeight: "bold", color: "white" }}>{companiesCount}</p>
        </div>

        <div style={{ background: "#111113", border: "1px solid #27272a", padding: "1.5rem", borderRadius: "12px" }}>
          <h3 style={{ color: "#a1a1aa", fontSize: "0.9rem", marginBottom: "0.5rem" }}>Total Users</h3>
          <p style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#60a5fa" }}>{usersCount}</p>
        </div>
      </div>

      <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}>Quick Actions</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
        <Link href="/admin/opportunities/new" style={{ background: "#18181b", padding: "1.5rem", borderRadius: "10px", border: "1px solid #27272a", textDecoration: "none", color: "white", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>📝</span>
          <strong>Post Opportunity</strong>
        </Link>
        <Link href="#" style={{ background: "#18181b", padding: "1.5rem", borderRadius: "10px", border: "1px solid #27272a", textDecoration: "none", color: "white", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: 0.5 }}>
          <span style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>🏢</span>
          <strong>Manage Companies</strong>
          <span style={{ fontSize: "0.75rem", color: "#71717a" }}>Coming soon</span>
        </Link>
        <Link href="#" style={{ background: "#18181b", padding: "1.5rem", borderRadius: "10px", border: "1px solid #27272a", textDecoration: "none", color: "white", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: 0.5 }}>
          <span style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>👥</span>
          <strong>Manage Users</strong>
          <span style={{ fontSize: "0.75rem", color: "#71717a" }}>Coming soon</span>
        </Link>
      </div>

    </div>
  );
}
