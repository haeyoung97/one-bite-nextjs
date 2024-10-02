import { BookData } from "@/types";
import Link from "next/link";
import "./globals.css";
import style from "./layout.module.css";

async function Footer() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/book`,
    { cache: "force-cache" }
  );
  if (!response.ok) return <div>오류가 발생했습니다...</div>;

  const books: BookData[] = await response.json();
  const bookCount = books.length;

  return (
    <footer className={style.footer}>
      <div>제작 @hypark</div>
      <div>{bookCount}개의 도서가 등록되어 있습니다.</div>
    </footer>
  );
}

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
            <Link href={"/"}>📚 ONEBITE CINEMA</Link>
          </header>
          <main className={style.main}>{children}</main>
          <Footer />
        </div>
        {modal}
        <div id="modal-root"></div>
      </body>
    </html>
  );
}
