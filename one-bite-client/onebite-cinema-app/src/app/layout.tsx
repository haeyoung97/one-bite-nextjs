import Link from "next/link";
import "./globals.css";
import style from "./layout.module.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className={style.container}>
          <header className={style.header}>
            <Link href={"/"}>ONEBITE CINEMA</Link>
          </header>
          {children}
          <footer></footer>
        </div>
      </body>
    </html>
  );
}
