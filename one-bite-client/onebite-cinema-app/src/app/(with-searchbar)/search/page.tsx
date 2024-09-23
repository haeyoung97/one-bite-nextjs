import MovieItem from "@/components/MovieItem";
import movies from "@/mock/movies.json";
import style from "./page.module.css";

export default function Page({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  return (
    <div className={style.container}>
      {movies.map((movie) => (
        <MovieItem key={movie.id} {...movie} />
      ))}
    </div>
  );
}
