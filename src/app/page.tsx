import Link from "next/link";

export default function Home() {
  return (
    <div style={{ minHeight: "100vh", background: "#09090b", color: "#fafafa" }}>
      {/* Navbar */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        background: "rgba(9,9,11,0.8)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid #1d1d21", padding: "0 2rem",
        display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{
            width: "32px", height: "32px", borderRadius: "8px",
            background: "linear-gradient(135deg, #6d28d9, #06b6d4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "16px"
          }}>⚡</div>
          <span style={{ fontWeight: 700, fontSize: "1.1rem", fontFamily: "Plus Jakarta Sans, sans-serif" }}>
            OpportunityHub
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link href="/login" style={{
            color: "#a1a1aa", textDecoration: "none", fontSize: "0.875rem", fontWeight: 500,
            padding: "0.5rem 1rem", borderRadius: "8px", transition: "all 0.2s"
          }}>Sign in</Link>
          <Link href="/signup" style={{
            background: "linear-gradient(135deg, #6d28d9, #7c3aed)",
            color: "white", textDecoration: "none", fontSize: "0.875rem", fontWeight: 600,
            padding: "0.5rem 1.25rem", borderRadius: "10px"
          }}>Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        paddingTop: "140px", paddingBottom: "80px", textAlign: "center",
        background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(109,40,217,0.25) 0%, transparent 70%)"
      }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 2rem" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "0.5rem",
            background: "rgba(109,40,217,0.15)", border: "1px solid rgba(109,40,217,0.3)",
            borderRadius: "9999px", padding: "0.3rem 1rem", marginBottom: "2rem",
            fontSize: "0.75rem", fontWeight: 600, color: "#a78bfa", letterSpacing: "0.05em"
          }}>
            ✨ INTERNSHIP & PLACEMENT INTELLIGENCE PLATFORM
          </div>

          <h1 style={{
            fontSize: "clamp(2.5rem, 6vw, 4rem)", fontWeight: 900,
            fontFamily: "Plus Jakarta Sans, sans-serif", lineHeight: 1.1,
            marginBottom: "1.5rem", letterSpacing: "-0.02em"
          }}>
            Find Internships &{" "}
            <span style={{
              background: "linear-gradient(135deg, #8b5cf6, #06b6d4)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
            }}>
              Placements
            </span>{" "}
            in One Place
          </h1>

          <p style={{
            fontSize: "1.125rem", color: "#a1a1aa", maxWidth: "560px",
            margin: "0 auto 2.5rem", lineHeight: 1.7
          }}>
            Discover opportunities from supported and verified sources. Filter what matters.
            Get notified before deadlines. Apply directly on the original website.
          </p>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/signup?type=internship" style={{
              background: "linear-gradient(135deg, #0891b2, #06b6d4)",
              color: "white", textDecoration: "none", fontWeight: 700,
              padding: "0.875rem 2rem", borderRadius: "12px", fontSize: "0.95rem",
              display: "flex", alignItems: "center", gap: "0.5rem",
              boxShadow: "0 8px 24px rgba(6,182,212,0.3)"
            }}>
              🎓 Find Internships
            </Link>
            <Link href="/signup?type=placement" style={{
              background: "linear-gradient(135deg, #6d28d9, #7c3aed)",
              color: "white", textDecoration: "none", fontWeight: 700,
              padding: "0.875rem 2rem", borderRadius: "12px", fontSize: "0.95rem",
              display: "flex", alignItems: "center", gap: "0.5rem",
              boxShadow: "0 8px 24px rgba(109,40,217,0.3)"
            }}>
              💼 Find Placements
            </Link>
          </div>

          {/* Stats */}
          <div style={{
            display: "flex", gap: "3rem", justifyContent: "center", marginTop: "4rem",
            padding: "2rem", background: "rgba(24,24,27,0.5)",
            border: "1px solid #27272a", borderRadius: "16px", flexWrap: "wrap"
          }}>
            {[
              { num: "500+", label: "Opportunities" },
              { num: "50+", label: "Companies" },
              { num: "10+", label: "Sources" },
              { num: "Free", label: "Always" },
            ].map((stat) => (
              <div key={stat.label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#a78bfa" }}>{stat.num}</div>
                <div style={{ fontSize: "0.8rem", color: "#71717a", fontWeight: 500 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "80px 2rem", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", color: "#6d28d9", textTransform: "uppercase", marginBottom: "1rem" }}>
            FEATURES
          </p>
          <h2 style={{ fontSize: "2rem", fontWeight: 800, fontFamily: "Plus Jakarta Sans", marginBottom: "1rem" }}>
            Everything You Need to Land Your Opportunity
          </h2>
          <p style={{ color: "#71717a", maxWidth: "500px", margin: "0 auto" }}>
            A comprehensive platform built specifically for students seeking internships and placements.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
          {[
            { icon: "🔍", title: "Powerful Search & Filters", desc: "Filter by role, location, work mode, stipend, skills, graduation year, and more." },
            { icon: "🔔", title: "Smart Notifications", desc: "Get notified about new opportunities matching your preferences and deadline reminders." },
            { icon: "🏢", title: "Company Following", desc: "Follow companies and be the first to know when they open new opportunities." },
            { icon: "💾", title: "Save Opportunities", desc: "Bookmark interesting opportunities and revisit them anytime from your saved list." },
            { icon: "📊", title: "Opportunity History", desc: "See a company's full hiring history — even closed opportunities remain visible." },
            { icon: "🔗", title: "Apply on Original Site", desc: "Always redirected to the original source URL. We never process your applications." },
          ].map((f) => (
            <div key={f.title} style={{
              background: "#111113", border: "1px solid #1d1d21", borderRadius: "16px",
              padding: "1.5rem", transition: "all 0.2s"
            }}>
              <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>{f.icon}</div>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem" }}>{f.title}</h3>
              <p style={{ fontSize: "0.875rem", color: "#71717a", lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: "60px 2rem", background: "#0d0d10" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", color: "#6d28d9", textTransform: "uppercase", marginBottom: "1rem" }}>
            HOW IT WORKS
          </p>
          <h2 style={{ fontSize: "2rem", fontWeight: 800, fontFamily: "Plus Jakarta Sans", marginBottom: "3rem" }}>
            Simple. Transparent. Student-First.
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", textAlign: "left" }}>
            {[
              { step: "01", title: "Sign Up & Set Preferences", desc: "Tell us your graduation year, branch, preferred roles, locations, and skills." },
              { step: "02", title: "Discover Opportunities", desc: "Browse internships and placements from verified sources. Use filters to narrow down." },
              { step: "03", title: "Save & Follow", desc: "Save opportunities for later. Follow companies to get re-hiring alerts." },
              { step: "04", title: "Apply on Original Website", desc: "Click Apply Now → redirected to the company's official page. No middleman." },
            ].map((s) => (
              <div key={s.step} style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start" }}>
                <div style={{
                  minWidth: "48px", height: "48px", borderRadius: "12px",
                  background: "rgba(109,40,217,0.2)", border: "1px solid rgba(109,40,217,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 800, color: "#a78bfa", fontSize: "0.875rem"
                }}>{s.step}</div>
                <div>
                  <h3 style={{ fontWeight: 700, marginBottom: "0.25rem" }}>{s.title}</h3>
                  <p style={{ color: "#71717a", fontSize: "0.875rem" }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 2rem", textAlign: "center" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "2.5rem", fontWeight: 800, fontFamily: "Plus Jakarta Sans", marginBottom: "1rem" }}>
            Ready to Find Your{" "}
            <span style={{
              background: "linear-gradient(135deg, #8b5cf6, #06b6d4)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
            }}>
              Opportunity?
            </span>
          </h2>
          <p style={{ color: "#71717a", marginBottom: "2rem" }}>
            Join students who are discovering internships and placements before everyone else.
          </p>
          <Link href="/signup" style={{
            background: "linear-gradient(135deg, #6d28d9, #7c3aed)",
            color: "white", textDecoration: "none", fontWeight: 700,
            padding: "1rem 2.5rem", borderRadius: "12px", fontSize: "1rem",
            display: "inline-flex", alignItems: "center", gap: "0.5rem",
            boxShadow: "0 8px 32px rgba(109,40,217,0.4)"
          }}>
            Get Started — It&apos;s Free →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #1d1d21", padding: "2rem", textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginBottom: "1rem" }}>
          <div style={{
            width: "24px", height: "24px", borderRadius: "6px",
            background: "linear-gradient(135deg, #6d28d9, #06b6d4)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px"
          }}>⚡</div>
          <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>OpportunityHub</span>
        </div>
        <p style={{ color: "#52525b", fontSize: "0.8rem" }}>
          A centralized discovery platform for students. We do not process applications.
          All opportunities redirect to their original source.
        </p>
        <p style={{ color: "#3f3f46", fontSize: "0.75rem", marginTop: "0.5rem" }}>
          © 2026 OpportunityHub. Built for students.
        </p>
      </footer>
    </div>
  );
}
