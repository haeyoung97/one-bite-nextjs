import MovieItem from "@/components/MovieItem";
import SearchableLayout from "@/components/SearchableLayout";
import fetchMovies from "@/lib/fetchMovies";
import { MovieData } from "@/types";
import Head from "next/head";
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
    <>
      <Head>
        <title>한입 씨네마 - 검색결과</title>
        <meta property="og:image" content="/thumbnail.png" />
        <meta property="og:title" content="한입 씨네마 - 검색결과" />
        <meta
          property="og:description"
          content="한입 씨네마에 등록된 영화들을 만나보세요."
        />
      </Head>
      <div className={style.container}>
        {movies.map((movie) => (
          <MovieItem key={movie.id} {...movie} />
        ))}
      </div>
    </>
  );
}

Page.getLayout = (page: ReactNode) => {
  return <SearchableLayout>{page}</SearchableLayout>;
};
