// app/auth-pages/layout.tsx
export default function Layout({
                                   children,
                               }: {
    children: React.ReactNode;
}) {
    return (
        <div className="w-full flex flex-col gap-12 justify-center">{children}</div>
    );
}

