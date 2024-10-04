import ReviewEditor from "@/components/ReviewEditor";
import ReviewItem from "@/components/ReviewItem";
import { BookData, ReviewData } from "@/types";
import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import style from "./page.module.css";

/**
 * generateStaticParams 에서 설정한 파라미터 이외의 값은 dynamic 으로 처리하지 않는다.
 */
// export const dynamicParams = false;

/**
 * 빌드 타임에 미리 렌더링을 완료할 수 있으며, full route cache를 적용할 수 있다.
 * Page Router의 getStaticPaths 와 동일한 역할을 수행한다.
 */
export function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }, { id: "3" }];
}

async function BookDetail({ bookId }: { bookId: string }) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/book/${bookId}`
  );
  if (!response.ok) {
    if (response.status === 404) notFound();
    return <div>오류가 발생했습니다...</div>;
  }
  const bookData: BookData = await response.json();
  const { title, subTitle, description, author, publisher, coverImgUrl } =
    bookData;
  return (
    <section>
      <div
        className={style.cover_img_container}
        style={{ backgroundImage: `url(${coverImgUrl})` }}
      >
        <Image
          src={coverImgUrl}
          width={240}
          height={300}
          alt={`도서 ${title}의 표지 이미지`}
        />
      </div>
      <div className={style.title}>{title}</div>
      <div className={style.subTitle}>{subTitle}</div>
      <div className={style.author}>
        {author} | {publisher}
      </div>
      <div className={style.description}>{description}</div>
    </section>
  );
}

async function ReviewList({ bookId }: { bookId: string }) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/review/book/${bookId}`,
    { next: { tags: [`review-${bookId}`] } }
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
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/book/${params.id}`
  );
  if (!response.ok) throw new Error(response.statusText);

  const bookData: BookData = await response.json();
  const { title, description, coverImgUrl } = bookData;

  return {
    title: `${title} - 한입북스`,
    description: `${description}`,
    openGraph: {
      title: `${title} - 한입북스`,
      description: `${description}`,
      images: [coverImgUrl],
    },
  };
}
export default function Page({ params }: { params: { id: string } }) {
  return (
    <div className={style.container}>
      <BookDetail bookId={params.id} />
      <ReviewEditor bookId={params.id} />
      <ReviewList bookId={params.id} />
    </div>
  );
}
