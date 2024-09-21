export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <div>임시 서치바</div>
      {children}
    </div>
  );
}
