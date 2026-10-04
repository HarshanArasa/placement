import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { User, Mail, GraduationCap, MapPin, Building } from "lucide-react";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const user = await db.user.findUnique({ where: { email: session.user.email } });
  if (!user) redirect("/login");

  return (
    <div className="animate-fade-in max-w-3xl">
      <header style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "0.25rem", fontFamily: "Plus Jakarta Sans" }}>
          My Profile
        </h1>
        <p style={{ color: "#71717a" }}>Manage your personal information.</p>
      </header>

      <div className="card" style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "2rem" }}>
          <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "#27272a", display: "flex", alignItems: "center", justifyContent: "center", color: "#a1a1aa", fontSize: "2rem", fontWeight: 600 }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#fafafa" }}>{user.name}</h2>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#a1a1aa", fontSize: "0.9rem" }}>
              <Mail size={16} /> {user.email}
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          <div>
            <label className="section-label" style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <GraduationCap size={14} /> College / University
            </label>
            <div className="input" style={{ background: "#111113", color: user.college ? "#fafafa" : "#71717a" }}>
              {user.college || "Not specified"}
            </div>
          </div>
          <div>
            <label className="section-label" style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <Building size={14} /> Branch / Major
            </label>
            <div className="input" style={{ background: "#111113", color: user.branch ? "#fafafa" : "#71717a" }}>
              {user.branch || "Not specified"}
            </div>
          </div>
          <div>
            <label className="section-label" style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <User size={14} /> Graduation Year
            </label>
            <div className="input" style={{ background: "#111113", color: user.graduationYear ? "#fafafa" : "#71717a" }}>
              {user.graduationYear || "Not specified"}
            </div>
          </div>
          <div>
            <label className="section-label" style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <MapPin size={14} /> Location
            </label>
            <div className="input" style={{ background: "#111113", color: user.location ? "#fafafa" : "#71717a" }}>
              {user.location || "Not specified"}
            </div>
          </div>
        </div>
      </div>
      
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button className="btn-primary">Edit Profile</button>
      </div>
    </div>
  );
}
