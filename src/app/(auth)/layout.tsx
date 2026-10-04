export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#09090b",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
      backgroundImage: "radial-gradient(ellipse 60% 60% at 50% -10%, rgba(109,40,217,0.2) 0%, transparent 70%)"
    }}>
      {children}
    </div>
  );
}
