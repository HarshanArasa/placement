"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AddOpportunityPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    title: "",
    companyName: "",
    opportunityType: "INTERNSHIP",
    location: "",
    sourceUrl: "",
    deadline: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/opportunities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        alert("Success! Opportunity added and Company checked/created.");
        router.push("/admin/opportunities"); // or reset form
        setFormData({ title: "", companyName: "", opportunityType: "INTERNSHIP", location: "", sourceUrl: "", deadline: "", description: "" });
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
      <Link 
        href="/admin/opportunities" 
        style={{ display: "inline-block", marginBottom: "1.5rem", color: "#a1a1aa", textDecoration: "none", fontSize: "0.9rem", fontWeight: 500 }}
      >
        ← Back to Opportunities
      </Link>
      
      <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1.5rem" }}>Post New Opportunity</h1>
      <p style={{ color: "#71717a", marginBottom: "2rem" }}>
        Enter the details below. If the company does not exist, it will be added to the database automatically. 
        When the deadline passes, the system will mark it as expired.
      </p>

      {error && (
        <div style={{ background: "rgba(239,68,68,0.1)", color: "#f87171", padding: "1rem", borderRadius: "10px", marginBottom: "1rem" }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        
        {/* Title & Company */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "#a1a1aa" }}>Opportunity Title (e.g. Software Engineer Intern)</label>
            <input 
              type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
              style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", background: "#18181b", border: "1px solid #27272a", color: "white" }} 
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "#a1a1aa" }}>Company Name</label>
            <input 
              type="text" required value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})}
              style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", background: "#18181b", border: "1px solid #27272a", color: "white" }} 
              placeholder="e.g. Google, Microsoft"
            />
          </div>
        </div>

        {/* Type & Location */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "#a1a1aa" }}>Opportunity Type</label>
            <select 
              value={formData.opportunityType} onChange={e => setFormData({...formData, opportunityType: e.target.value})}
              style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", background: "#18181b", border: "1px solid #27272a", color: "white" }}
            >
              <option value="INTERNSHIP">Internship</option>
              <option value="PLACEMENT">Placement (Full-time)</option>
              <option value="BOTH">Both</option>
            </select>
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "#a1a1aa" }}>Location</label>
            <input 
              type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})}
              style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", background: "#18181b", border: "1px solid #27272a", color: "white" }} 
              placeholder="e.g. Bangalore, Remote"
            />
          </div>
        </div>

        {/* Deadline & URL */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "#a1a1aa" }}>
              Deadline (Date & Time)
            </label>
            <input 
              type="datetime-local" required value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})}
              style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", background: "#18181b", border: "1px solid #27272a", color: "white", colorScheme: "dark" }} 
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "#a1a1aa" }}>Application URL</label>
            <input 
              type="url" required value={formData.sourceUrl} onChange={e => setFormData({...formData, sourceUrl: e.target.value})}
              style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", background: "#18181b", border: "1px solid #27272a", color: "white" }} 
              placeholder="https://..."
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "#a1a1aa" }}>Description / Notes (Optional)</label>
          <textarea 
            rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
            style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", background: "#18181b", border: "1px solid #27272a", color: "white", resize: "vertical" }} 
          />
        </div>

        <button 
          type="submit" disabled={loading}
          style={{
            marginTop: "1rem", padding: "1rem", borderRadius: "10px", fontWeight: "bold",
            background: loading ? "#3f3f46" : "linear-gradient(135deg, #6d28d9, #06b6d4)",
            color: "white", border: "none", cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "Adding Opportunity..." : "Post Opportunity"}
        </button>
      </form>
    </div>
  );
}
