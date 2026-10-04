"use client";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function SignOutPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card max-w-md w-full text-center p-8">
        <div style={{ display: "inline-flex", background: "rgba(239, 68, 68, 0.1)", padding: "1rem", borderRadius: "50%", marginBottom: "1.5rem" }}>
          <LogOut size={32} color="#ef4444" />
        </div>
        <h1 className="text-2xl font-bold mb-2 text-white">Sign out</h1>
        <p className="text-muted-foreground mb-8">
          Are you sure you want to sign out of your account? You will need to log back in to access your dashboard.
        </p>
        
        <div className="flex gap-4">
          <button 
            className="btn-secondary flex-1 justify-center" 
            onClick={() => router.back()}
          >
            Cancel
          </button>
          <button 
            className="btn-primary flex-1 justify-center" 
            style={{ background: "#ef4444" }}
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
