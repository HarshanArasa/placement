"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Home, Briefcase, GraduationCap, Bookmark, Bell, User, Settings, Menu, X } from "lucide-react";
import { useState } from "react";

export default function AppLayout({ children, user }: { children: React.ReactNode, user: any }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const userName = user?.name || "User";
  const userRole = user?.role || "STUDENT";

  const navLinks = [
    { section: "DISCOVER" },
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/internships", label: "Internships", icon: GraduationCap },
    { href: "/placements", label: "Placements", icon: Briefcase },
    { href: "/companies", label: "Companies", icon: Briefcase },
    { section: "MY HUB" },
    { href: "/saved", label: "Saved", icon: Bookmark },
    { href: "/notifications", label: "Notifications", icon: Bell },
    { href: "/profile", label: "Profile", icon: User },
    { href: "/preferences", label: "Preferences", icon: Settings },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Mobile Header */}
      <div style={{ display: "none" }} className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#09090b] border-b border-[#1d1d21] z-50 flex items-center justify-between px-4">
        <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none", color: "white" }}>
          <div style={{ width: "28px", height: "28px", borderRadius: "6px", background: "linear-gradient(135deg, #6d28d9, #06b6d4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>⚡</div>
          <span style={{ fontWeight: 800, fontSize: "1rem", fontFamily: "Plus Jakarta Sans" }}>OpportunityHub</span>
        </Link>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: "none", border: "none", color: "white" }}>
          {sidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`} style={{ padding: "1.5rem 0", display: "flex", flexDirection: "column", transition: "transform 0.3s ease" }}>
        <div style={{ padding: "0 1.5rem", marginBottom: "2rem" }} className="hidden md:block">
          <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none", color: "white" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "linear-gradient(135deg, #6d28d9, #06b6d4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>⚡</div>
            <span style={{ fontWeight: 800, fontSize: "1.1rem", fontFamily: "Plus Jakarta Sans" }}>OpportunityHub</span>
          </Link>
        </div>

        <nav style={{ flex: 1, padding: "0 1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {navLinks.map((link, i) => {
            if (link.section) {
              return <div key={`sec-${i}`} style={{ fontSize: "0.75rem", fontWeight: 700, color: "#52525b", letterSpacing: "0.05em", padding: "1rem 0.5rem 0" }}>{link.section}</div>;
            }
            const Icon = link.icon!;
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link key={link.href} href={link.href!} className={`nav-link ${isActive ? "active" : ""}`} onClick={() => setSidebarOpen(false)}>
                <Icon size={18} /> {link.label}
              </Link>
            );
          })}

          {userRole === "ADMIN" && (
            <>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#52525b", letterSpacing: "0.05em", padding: "1rem 0.5rem 0" }}>ADMIN</div>
              <Link href="/admin/dashboard" className={`nav-link ${pathname.startsWith("/admin") ? "active" : ""}`}>Admin Panel</Link>
            </>
          )}
        </nav>

        <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid #1d1d21", marginTop: "auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#27272a", display: "flex", alignItems: "center", justifyContent: "center", color: "#a1a1aa", fontWeight: 600 }}>
              {userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "#fafafa", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", maxWidth: "150px" }}>{userName}</div>
              <div style={{ fontSize: "0.75rem", color: "#71717a" }}>{userRole}</div>
            </div>
          </div>
          <Link href="/signout" className="btn-ghost" style={{ width: "100%", justifyContent: "center" }}>
            <LogOut size={16} /> Sign out
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content" style={{ flex: 1, padding: "2rem", width: "100%", paddingTop: "5rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {children}
        </div>
      </main>
      
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 30 }}
          className="md:hidden"
        />
      )}
    </div>
  );
}
