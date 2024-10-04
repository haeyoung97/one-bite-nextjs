import MovieItem from "@/components/MovieItem";
import { MovieData } from "@/types";
import { Metadata } from "next";
import style from "./page.module.css";

async function AllMovies() {
  /**
   * 새로운 데이터가 추가되거나 삭제되지 않기 때문에 "force-cache" 로 설정.
   * 다만, 데이터의 추가/삭제 기능이 추가된다면, ISR 동작으로 변경되면 좋을 것 같다.
   */
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/movie`,
    { cache: "force-cache" }
  );

  if (!response.ok) return <div>오류가 발생했습니다...</div>;

  const allMovies: MovieData[] = await response.json();
  return allMovies.map((movie) => <MovieItem key={movie.id} {...movie} />);
}

async function RecommendMovies() {
  /**
   * 랜덤으로 제공되는 데이터이므로 특정 시간을 주기로 업데이트.
   */
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/movie/random`,
    { next: { revalidate: 3 } }
  );

  if (!response.ok) return <div>오류가 발생했습니다...</div>;

  const recommendBooks: MovieData[] = await response.json();
  return recommendBooks.map((movie) => <MovieItem key={movie.id} {...movie} />);
}

export const metadata: Metadata = {
  title: "한입 씨네마",
  description: "한입 씨네마에 등록된 영화를 만나보세요.",
  openGraph: {
    title: "한입 씨네마",
    description: "한입 씨네마에 등록된 영화를 만나보세요.",
    images: ["/thumbnail.png"],
  },
};

export default function Home() {
  return (
    <div className={style.container}>
      <section>
        <h3>지금 가장 추천하는 영화</h3>
        <div className={style.reco_container}>
          <RecommendMovies />
        </div>
      </section>
      <section>
        <h3>등록된 모든 영화</h3>
        <div className={style.all_container}>
          <AllMovies />
        </div>
      </section>
    </div>
  );
}
