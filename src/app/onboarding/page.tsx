import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function OnboardingPage() {
  const session = await auth();
  
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 hero-gradient">
      <div className="card max-w-lg w-full text-center p-8 glass animate-fade-in">
        <h1 className="text-3xl font-bold mb-4 gradient-text">Welcome, {session.user?.name}!</h1>
        <p className="text-muted-foreground mb-8">
          Your account has been created successfully. Let's set up your profile so we can find the best opportunities for you.
        </p>
        
        <div className="flex flex-col gap-4">
          <Link href="/dashboard" className="btn-primary justify-center w-full">
            Go to Dashboard
          </Link>
          <button className="btn-secondary justify-center w-full" disabled>
            Set up Preferences (Coming Soon)
          </button>
        </div>
      </div>
    </div>
  );
}
