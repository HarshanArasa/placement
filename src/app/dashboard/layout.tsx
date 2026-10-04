import { auth } from "@/lib/auth";
import AppLayout from "@/components/layout/AppLayout";
import { redirect } from "next/navigation";

export default async function DashboardLayoutWrapper({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");

  return <AppLayout user={session.user}>{children}</AppLayout>;
}
