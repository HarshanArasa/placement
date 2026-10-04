import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function PreferencesPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const user = await db.user.findUnique({ where: { email: session.user.email }, include: { preference: true } });
  if (!user) redirect("/login");

  const pref = user.preference;

  return (
    <div className="animate-fade-in max-w-3xl">
      <header style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "0.25rem", fontFamily: "Plus Jakarta Sans" }}>
          Preferences
        </h1>
        <p style={{ color: "#71717a" }}>Customize your opportunity matches and alerts.</p>
      </header>

      <div className="card" style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 600, color: "#fafafa", marginBottom: "1.5rem" }}>Opportunity Preferences</h2>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div>
            <label className="section-label" style={{ marginBottom: "0.5rem", display: "block" }}>I am looking for</label>
            <div style={{ display: "flex", gap: "1rem" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#d4d4d8" }}>
                <input type="checkbox" defaultChecked={pref?.preferredOpportunityTypes?.includes("INTERNSHIP")} style={{ width: "16px", height: "16px", accentColor: "#8b5cf6" }} />
                Internships
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#d4d4d8" }}>
                <input type="checkbox" defaultChecked={pref?.preferredOpportunityTypes?.includes("PLACEMENT")} style={{ width: "16px", height: "16px", accentColor: "#8b5cf6" }} />
                Placements
              </label>
            </div>
          </div>
          
          <div>
            <label className="section-label" style={{ marginBottom: "0.5rem", display: "block" }}>Work Mode</label>
            <div style={{ display: "flex", gap: "1rem" }}>
              {["REMOTE", "HYBRID", "ONSITE"].map(mode => (
                <label key={mode} style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#d4d4d8" }}>
                  <input type="checkbox" defaultChecked={pref?.preferredWorkModes?.includes(mode as any)} style={{ width: "16px", height: "16px", accentColor: "#8b5cf6" }} />
                  {mode.charAt(0) + mode.slice(1).toLowerCase()}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 600, color: "#fafafa", marginBottom: "1.5rem" }}>Notification Settings</h2>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem", background: "#111113", borderRadius: "10px", cursor: "pointer" }}>
            <div>
              <div style={{ fontWeight: 500, color: "#fafafa" }}>Email Notifications</div>
              <div style={{ fontSize: "0.85rem", color: "#71717a" }}>Receive daily digests and important alerts</div>
            </div>
            <input type="checkbox" defaultChecked={pref?.emailNotifications ?? true} style={{ width: "20px", height: "20px", accentColor: "#8b5cf6" }} />
          </label>
          <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem", background: "#111113", borderRadius: "10px", cursor: "pointer" }}>
            <div>
              <div style={{ fontWeight: 500, color: "#fafafa" }}>Push Notifications</div>
              <div style={{ fontSize: "0.85rem", color: "#71717a" }}>Get instant alerts on your device</div>
            </div>
            <input type="checkbox" defaultChecked={pref?.pushNotifications ?? false} style={{ width: "20px", height: "20px", accentColor: "#8b5cf6" }} />
          </label>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button className="btn-primary">Save Preferences</button>
      </div>
    </div>
  );
}
