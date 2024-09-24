import fetchMovies from "@/lib/fetchMovies";
import fetchOneMovie from "@/lib/fetchOneMovie";
import { GetServerSidePropsContext, InferGetStaticPropsType } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import style from "./[id].module.css";

export const getStaticPaths = async () => {
  const movies = await fetchMovies();
  return {
    // 항상 동일한 정보를 제공하기 때문에 모든 영화 페이지를 미리 생성.
    paths: movies.map((movie) => ({ params: { id: `${movie.id}` } })),
    fallback: true,
  };
};

export const getStaticProps = async (context: GetServerSidePropsContext) => {
  const id = context.params!.id;
  const movie = await fetchOneMovie(Number(id));

  if (!movie) return { notFound: true };
  return { props: { movie } };
};

export default function Page({
  movie,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter();
  if (router.isFallback)
    return (
      <>
        <Head>
          <title>한입 씨네마</title>
          <meta property="og:image" content="/thumbnail.png" />
          <meta property="og:title" content="한입 씨네마" />
          <meta
            property="og:description"
            content="한입 씨네마에 등록된 영화들을 만나보세요."
          />
        </Head>
        <div>로딩 중입니다.</div>
      </>
    );
  if (movie === null) return "문제가 발생했습니다. 다시 시도하세요.";

  const {
    title,
    subTitle,
    releaseDate,
    description,
    company,
    runtime,
    genres,
    posterImgUrl,
  } = movie;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta property="og:image" content={posterImgUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
      </Head>
      <div className={style.container}>
        <div
          className={style.cover_img_container}
          style={{ backgroundImage: `url(${posterImgUrl})` }}
        >
          <img src={posterImgUrl} />
        </div>
        <div className={style.title}>{title}</div>
        <div>
          {releaseDate} / {genres.join(", ")} / {runtime}분
        </div>
        <div className={style.company}>{company}</div>
        <div className={style.subTitle}>{subTitle}</div>
        <div className={style.description}>{description}</div>
      </div>
    </>
  );
}
