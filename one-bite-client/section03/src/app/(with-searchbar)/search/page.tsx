import BookItem from "@/components/BookItem";
import { BookData } from "@/types";

// 동적 함수를 사용하고 있기 때문에 동적 페이지로 설정된다.
export default async function Page({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/book/search?q=${searchParams.q}`,
    { cache: "force-cache" }
  );
  if (!response.ok) return <div>오류가 발생했습니다...</div>;

  const books: BookData[] = await response.json();

  return (
    <div>
      {books.map((book) => (
        <BookItem key={book.id} {...book} />
      ))}
    </div>
  );
}
