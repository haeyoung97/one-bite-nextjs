import { MovieData } from "@/types";
import style from "./page.module.css";

export default async function Page({
  params,
}: {
  params: { id: string | string[] };
}) {
  /**
   * 데이터가 수정되지 않기 때문에 "force-cache" 로 설정.
   * 다만, 데이터의 수정 기능이 추가된다면, ISR 동작으로 변경되면 좋을 것 같다.
   */
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/movie/${params.id}`,
    { cache: "force-cache" }
  );

  if (!response.ok) return <div>오류가 발생했습니다...</div>;

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
  );
}
