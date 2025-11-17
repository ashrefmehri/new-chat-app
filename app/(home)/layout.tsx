export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full bg-gray-50 h-screen">
        {children}
    </div>
  );
}