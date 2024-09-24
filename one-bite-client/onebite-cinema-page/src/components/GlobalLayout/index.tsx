import Link from "next/link";
import { ReactNode } from "react";
import style from "./index.module.css";

export default function GlobalLayout({ children }: { children: ReactNode }) {
  return (
    <div className={style.container}>
      <header className={style.header}>
        <Link href={"/"}>ONEBITE CINEMA</Link>
      </header>
      {children}
      <footer></footer>
    </div>
  );
}
