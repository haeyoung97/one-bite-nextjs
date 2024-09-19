import MovieItem from "@/components/MovieItem";
import SearchableLayout from "@/components/SearchableLayout";
import fetchMovies from "@/lib/fetchMovies";
import { MovieData } from "@/types";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";
import style from "./index.module.css";

export default function Page() {
  const [movies, setMovies] = useState<MovieData[]>([]);
  const router = useRouter();
  const q = router.query.q;

  const fetchSearchResult = async () => {
    const searchResult = await fetchMovies(q as string);
    setMovies(searchResult);
  };

  useEffect(() => {
    if (q) fetchSearchResult();
  }, [q]);

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
