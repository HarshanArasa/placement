import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { Bell } from "lucide-react";

export default async function NotificationsPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const user = await db.user.findUnique({ where: { email: session.user.email } });
  if (!user) redirect("/login");

  const notifications = await db.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 50
  });

  return (
    <div className="animate-fade-in max-w-3xl">
      <header style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "0.25rem", fontFamily: "Plus Jakarta Sans" }}>
            Notifications
          </h1>
          <p style={{ color: "#71717a" }}>Stay updated on your opportunities.</p>
        </div>
      </header>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {notifications.map((notif) => (
          <div key={notif.id} className="card" style={{ display: "flex", gap: "1rem", padding: "1.25rem", opacity: notif.isRead ? 0.7 : 1 }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(109, 40, 217, 0.1)", color: "#8b5cf6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Bell size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "#fafafa" }}>{notif.title}</h3>
                <span style={{ fontSize: "0.8rem", color: "#71717a" }}>{formatDate(notif.createdAt)}</span>
              </div>
              <p style={{ color: "#a1a1aa", fontSize: "0.9rem" }}>{notif.message}</p>
            </div>
          </div>
        ))}
        
        {notifications.length === 0 && (
          <div style={{ textAlign: "center", padding: "4rem 2rem", background: "#111113", borderRadius: "16px", border: "1px dashed #27272a" }}>
            <div style={{ display: "inline-flex", background: "#27272a", padding: "1rem", borderRadius: "50%", marginBottom: "1rem" }}>
              <Bell size={32} color="#a1a1aa" />
            </div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "#fafafa", marginBottom: "0.5rem" }}>No notifications yet</h3>
            <p style={{ color: "#a1a1aa", fontSize: "0.9rem" }}>When you get updates, they'll show up here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
