export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex min-h-svh w-full items-center justify-center p-6 md:p-10"
      style={{ background: "radial-gradient(125% 125% at 50% 10%, #000000 40%, #2b0707 100%)" }}
    >
      <div className="w-full max-w-115">{children}</div>
    </div>
  );
}
