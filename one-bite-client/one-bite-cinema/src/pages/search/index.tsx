import MovieItem from "@/components/MovieItem";
import SearchableLayout from "@/components/SearchableLayout";
import movies from "@/mock/dummy.json";
import { ReactNode } from "react";
import style from "./index.module.css";

export default function Page() {
  return (
    <div className={style.container}>
      {movies.map((movie) => (
        <MovieItem key={movie.id} {...movie} />
      ))}
    </div>
  );
}

Page.getLayout = (page: ReactNode) => {
  return <SearchableLayout>{page}</SearchableLayout>;
};
