import { BookData } from "@/types";
import { notFound } from "next/navigation";
import style from "./page.module.css";

// generateStaticParams 에서 설정한 파라미터 이외의 값은 dynamic 으로 처리하지 않는다.
// export const dynamicParams = false;

// 빌드 타임에 미리 렌더링을 완료할 수 있으며, full route cache를 적용할 수 있다.
// Page Router의 getStaticPaths 와 동일한 역할을 수행한다.
export function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }, { id: "3" }];
}

// 동적 정보를 가지고 있는 페이지이므로 동적 페이지로 설정된다.
export default async function Page({
  params,
}: {
  params: { id: string | string[] };
}) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/book/${params.id}`
  );
  if (!response.ok) {
    if (response.status === 404) notFound();
    return <div>오류가 발생했습니다...</div>;
  }
  const bookData: BookData = await response.json();
  const { title, subTitle, description, author, publisher, coverImgUrl } =
    bookData;
  return (
    <div className={style.container}>
      <div
        className={style.cover_img_container}
        style={{ backgroundImage: `url(${coverImgUrl})` }}
      >
        <img src={coverImgUrl} />
      </div>
      <div className={style.title}>{title}</div>
      <div className={style.subTitle}>{subTitle}</div>
      <div className={style.author}>
        {author} | {publisher}
      </div>
      <div className={style.description}>{description}</div>
    </div>
  );
}
