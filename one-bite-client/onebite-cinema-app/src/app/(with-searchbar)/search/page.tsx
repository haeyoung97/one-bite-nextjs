import MovieItem from "@/components/MovieItem";
import MovieListSkeleton from "@/components/skeleton/MovieListSkeleton";
import { MovieData } from "@/types";
import { Metadata } from "next";
import { Suspense } from "react";
import style from "./page.module.css";

async function SearchResults({ q }: { q: string }) {
  /**
   * 새로운 데이터가 추가되거나 삭제되지 않기 때문에 "force-cache" 로 설정.
   * 다만, 데이터의 추가/삭제 기능이 추가된다면, ISR 동작으로 변경되면 좋을 것 같다.
   */
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/movie/search?q=${q}`,
    { cache: "force-cache" }
  );
  if (!response.ok) return <div>오류가 발생했습니다...</div>;
  const movies: MovieData[] = await response.json();

  return movies.map((movie) => <MovieItem key={movie.id} {...movie} />);
}

type Props = { searchParams: { q?: string } };

export function generateMetadata({ searchParams }: Props): Metadata {
  return {
    title: `${searchParams.q} : 한입 씨네마 검색`,
    description: `${searchParams.q} 검색 결과입니다.`,
    openGraph: {
      title: `${searchParams.q} : 한입 씨네마 검색`,
      description: `${searchParams.q} 검색 결과입니다.`,
      images: ["/thumbnail.png"],
    },
  };
}

export default async function Page({ searchParams }: Props) {
  return (
    <div className={style.container}>
      <Suspense
        key={searchParams.q || ""}
        fallback={<MovieListSkeleton count={10} />}
      >
        <SearchResults q={searchParams.q || ""} />
      </Suspense>
    </div>
  );
}
