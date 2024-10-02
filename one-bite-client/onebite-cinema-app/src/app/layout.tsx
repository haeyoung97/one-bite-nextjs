import Link from "next/link";
import "./globals.css";
import style from "./layout.module.css";

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
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
        {modal}
        <div id="modal-root"></div>
      </body>
    </html>
  );
}
