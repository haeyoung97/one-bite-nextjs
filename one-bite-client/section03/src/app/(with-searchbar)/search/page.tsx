import BookItem from "@/components/BookItem";
import books from "@/mock/books.json";

export default function Page({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  return (
    <div>
      {books.map((book) => (
        <BookItem key={book.id} {...book} />
      ))}
    </div>
  );
}
