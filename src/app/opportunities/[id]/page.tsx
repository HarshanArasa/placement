"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AppLayout from "@/components/layout/AppLayout";
import { formatDate, formatRelativeDate, formatSalary, formatStipend, getStatusColor, getStatusLabel, isDeadlinePassed } from "@/lib/utils";
import { Bookmark, MapPin, Briefcase, GraduationCap, Clock, ExternalLink, Share2, Building2, Calendar, IndianRupee } from "lucide-react";
import Link from "next/link";

export default function OpportunityDetail() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const id = params.id as string;

  useEffect(() => {
    fetch(`/api/opportunities/${id}`)
      .then(res => res.json())
      .then(d => {
        if (d.error) router.push("/dashboard");
        else setData(d);
        setLoading(false);
      });
  }, [id, router]);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (data.isSaved) {
        await fetch(`/api/saved/${id}`, { method: "DELETE" });
        setData({ ...data, isSaved: false, opportunity: { ...data.opportunity, _count: { ...data.opportunity._count, savedBy: data.opportunity._count.savedBy - 1 } } });
      } else {
        await fetch("/api/saved", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ opportunityId: id }) });
        setData({ ...data, isSaved: true, opportunity: { ...data.opportunity, _count: { ...data.opportunity._count, savedBy: data.opportunity._count.savedBy + 1 } } });
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#09090b", color: "white" }}>Loading...</div>;
  if (!data?.opportunity) return null;

  const opp = data.opportunity;
  const isExpired = opp.status === "EXPIRED" || isDeadlinePassed(opp.deadline);

  return (
    <div style={{ background: "#09090b", minHeight: "100vh", color: "#fafafa" }}>
      {/* Navbar Minimal */}
      <nav style={{ padding: "1rem 2rem", borderBottom: "1px solid #1d1d21", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "rgba(9,9,11,0.8)", backdropFilter: "blur(12px)", zIndex: 40 }}>
        <Link href="/dashboard" style={{ color: "#a1a1aa", textDecoration: "none", fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          ← Back to Dashboard
        </Link>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button onClick={handleSave} disabled={saving} className={data.isSaved ? "btn-secondary" : "btn-ghost"} style={{ borderColor: data.isSaved ? "#6d28d9" : "transparent", color: data.isSaved ? "#a78bfa" : "#a1a1aa" }}>
            <Bookmark size={16} fill={data.isSaved ? "currentColor" : "none"} /> {data.isSaved ? "Saved" : "Save"}
          </button>
          <button className="btn-ghost" onClick={() => navigator.clipboard.writeText(window.location.href)}><Share2 size={16} /> Share</button>
        </div>
      </nav>

      <main style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem", display: "flex", flexDirection: "column", gap: "2rem" }}>
        {/* Header */}
        <header className="card" style={{ padding: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "2rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
              {opp.company.logoUrl ? (
                <img src={opp.company.logoUrl} alt={opp.company.name} style={{ width: "80px", height: "80px", borderRadius: "16px", background: "white", padding: "8px", objectFit: "contain", border: "1px solid #27272a" }} />
              ) : (
                <div style={{ width: "80px", height: "80px", borderRadius: "16px", background: "#27272a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem" }}>
                  <Building2 color="#71717a" />
                </div>
              )}
              <div>
                <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "0.25rem", fontFamily: "Plus Jakarta Sans" }}>{opp.title}</h1>
                <Link href={`/companies/${opp.company.id}`} style={{ color: "#a78bfa", fontSize: "1.1rem", fontWeight: 600, textDecoration: "none" }}>
                  {opp.company.name}
                </Link>
              </div>
            </div>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <span className={`badge ${getStatusColor(opp.status)}`}>{getStatusLabel(opp.status)}</span>
              <span className={`badge ${opp.opportunityType === "INTERNSHIP" ? "badge-internship" : "badge-placement"}`}>
                {opp.opportunityType}
              </span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem", background: "#111113", padding: "1.5rem", borderRadius: "12px", border: "1px solid #1d1d21" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <MapPin size={20} color="#71717a" />
              <div>
                <div style={{ fontSize: "0.75rem", color: "#71717a", fontWeight: 600 }}>LOCATION</div>
                <div style={{ color: "#fafafa" }}>{opp.location || "Remote"} ({opp.workMode})</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <IndianRupee size={20} color="#71717a" />
              <div>
                <div style={{ fontSize: "0.75rem", color: "#71717a", fontWeight: 600 }}>PAYOUT</div>
                <div style={{ color: "#fafafa" }}>
                  {opp.opportunityType === "INTERNSHIP" ? formatStipend(opp.stipendMin, opp.stipendMax) : formatSalary(opp.salaryMin, opp.salaryMax)}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <GraduationCap size={20} color="#71717a" />
              <div>
                <div style={{ fontSize: "0.75rem", color: "#71717a", fontWeight: 600 }}>BATCH</div>
                <div style={{ color: "#fafafa" }}>{opp.graduationYear ? `${opp.graduationYear} Batch` : "Any Batch"}</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <Calendar size={20} color="#71717a" />
              <div>
                <div style={{ fontSize: "0.75rem", color: "#71717a", fontWeight: 600 }}>DEADLINE</div>
                <div style={{ color: isExpired ? "#ef4444" : "#fafafa" }}>{formatDate(opp.deadline)}</div>
              </div>
            </div>
          </div>
        </header>

        {/* CTA Banner */}
        <div style={{ background: "linear-gradient(135deg, rgba(109,40,217,0.1), rgba(6,182,212,0.1))", border: "1px solid rgba(139,92,246,0.2)", borderRadius: "16px", padding: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.5rem" }}>
          <div>
            <h3 style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: "0.25rem" }}>Ready to apply?</h3>
            <p style={{ color: "#a1a1aa", fontSize: "0.9rem" }}>You will be redirected to the official {opp.company.name} careers page.</p>
          </div>
          <a href={opp.sourceUrl} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ padding: "0.875rem 2rem", fontSize: "1rem" }} onClick={() => {
            // Optional analytics track click
          }}>
            Apply Now <ExternalLink size={18} />
          </a>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2rem" }}>
          {/* Main info */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {opp.description && (
              <section className="card">
                <h3 className="section-label" style={{ marginBottom: "1rem" }}>Description</h3>
                <div style={{ color: "#d4d4d8", whiteSpace: "pre-wrap", lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: opp.description }} />
              </section>
            )}
            
            {opp.responsibilities && (
              <section className="card">
                <h3 className="section-label" style={{ marginBottom: "1rem" }}>Key Responsibilities</h3>
                <div style={{ color: "#d4d4d8", whiteSpace: "pre-wrap", lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: opp.responsibilities }} />
              </section>
            )}

            {opp.eligibility && (
              <section className="card">
                <h3 className="section-label" style={{ marginBottom: "1rem" }}>Eligibility</h3>
                <div style={{ color: "#d4d4d8", whiteSpace: "pre-wrap", lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: opp.eligibility }} />
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <section className="card">
              <h3 className="section-label" style={{ marginBottom: "1rem" }}>Skills Required</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {opp.skills.map((s: any) => (
                  <span key={s.skillId} style={{ background: "#27272a", color: "#d4d4d8", padding: "0.3rem 0.8rem", borderRadius: "8px", fontSize: "0.8rem", fontWeight: 500 }}>
                    {s.skill.name}
                  </span>
                ))}
                {opp.skills.length === 0 && <span style={{ color: "#71717a", fontSize: "0.875rem" }}>Not specified</span>}
              </div>
            </section>

            <section className="card" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <div style={{ fontSize: "0.75rem", color: "#71717a", fontWeight: 600, marginBottom: "0.25rem" }}>POSTED DATE</div>
                <div style={{ color: "#e4e4e7", fontSize: "0.9rem" }}>{formatDate(opp.postedAt)} ({formatRelativeDate(opp.postedAt)})</div>
              </div>
              <div>
                <div style={{ fontSize: "0.75rem", color: "#71717a", fontWeight: 600, marginBottom: "0.25rem" }}>SOURCE</div>
                <div style={{ color: "#e4e4e7", fontSize: "0.9rem" }}>{opp.source.name} <span style={{ color: "#71717a" }}>({opp.source.type.replace("_", " ")})</span></div>
              </div>
              <div>
                <div style={{ fontSize: "0.75rem", color: "#71717a", fontWeight: 600, marginBottom: "0.25rem" }}>VIEWS</div>
                <div style={{ color: "#e4e4e7", fontSize: "0.9rem" }}>{opp.viewCount} students viewed this</div>
              </div>
              <div>
                <div style={{ fontSize: "0.75rem", color: "#71717a", fontWeight: 600, marginBottom: "0.25rem" }}>SAVES</div>
                <div style={{ color: "#e4e4e7", fontSize: "0.9rem" }}>{opp._count.savedBy} students saved this</div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
