import { MovieData } from "@/types";
import Image from "next/image";
import Link from "next/link";
import style from "./index.module.css";

export default function MovieItem({ id, title, posterImgUrl }: MovieData) {
  return (
    <Link href={`/movie/${id}`} className={style.container}>
      <Image src={posterImgUrl} fill alt={`영화 ${title}의 표지 이미지`} />
    </Link>
  );
}
