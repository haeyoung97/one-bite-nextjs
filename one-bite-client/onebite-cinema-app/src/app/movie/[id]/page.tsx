import ReviewEditor from "@/components/ReviewEditor";
import ReviewItem from "@/components/ReviewItem";
import { MovieData, ReviewData } from "@/types";
import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import style from "./page.module.css";

export async function generateStaticParams() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/movie`
  );
  if (!response.ok) throw new Error(response.statusText);
  const movies: MovieData[] = await response.json();

  return movies.map((movie) => ({ id: `${movie.id}` }));
}

async function MovieDetail({ movieId }: { movieId: string }) {
  /**
   * 데이터가 수정되지 않기 때문에 "force-cache" 로 설정.
   * 다만, 데이터의 수정 기능이 추가된다면, ISR 동작으로 변경되면 좋을 것 같다.
   */
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/movie/${movieId}`,
    { cache: "force-cache" }
  );

  if (!response.ok) {
    if (response.status === 404) notFound();
    return <div>오류가 발생했습니다...</div>;
  }

  const movieData: MovieData = await response.json();

  const {
    title,
    releaseDate,
    company,
    genres,
    subTitle,
    description,
    runtime,
    posterImgUrl,
  } = movieData;
  return (
    <section>
      <div
        className={style.cover_img_container}
        style={{ backgroundImage: `url(${posterImgUrl})` }}
      >
        <Image src={posterImgUrl} fill alt={`영화 ${title}의 표지 이미지`} />
      </div>
      <div className={style.title}>{title}</div>
      <div>
        {releaseDate} / {genres.join(", ")} / {runtime}분
      </div>
      <div className={style.company}>{company}</div>
      <div className={style.subTitle}>{subTitle}</div>
      <div className={style.description}>{description}</div>
    </section>
  );
}

async function ReviewList({ movieId }: { movieId: string }) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/review/movie/${movieId}`,
    { next: { tags: [`review-${movieId}`] } }
  );

  if (!response.ok)
    throw new Error(`Review fetch failed : ${response.statusText}`);

  const reviews: ReviewData[] = await response.json();
  return (
    <section>
      {reviews.map((review) => (
        <ReviewItem key={`review-item-${review.id}`} {...review} />
      ))}
    </section>
  );
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata | null> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/movie/${params.id}`
  );
  if (!response.ok) throw new Error(response.statusText);

  const bookData: MovieData = await response.json();
  const { title, description, posterImgUrl } = bookData;

  return {
    title: `${title} - 한입 씨네마`,
    description: `${description}`,
    openGraph: {
      title: `${title} - 한입 씨네마`,
      description: `${description}`,
      images: [posterImgUrl],
    },
  };
}
export default async function Page({ params }: { params: { id: string } }) {
  return (
    <div className={style.container}>
      <MovieDetail movieId={params.id} />
      <ReviewEditor movieId={params.id} />
      <ReviewList movieId={params.id} />
    </div>
  );
}
