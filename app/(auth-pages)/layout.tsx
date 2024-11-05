//(auth-pages)\layout.tsx
export default function Layout({
                                 children,
                               }: {
  children: React.ReactNode;
}) {
  return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="max-w-7xl w-full p-8">{children}</div>
      </div>
  );
}