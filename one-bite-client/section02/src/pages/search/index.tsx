import BookItem from "@/components/BookItem";
import SearchableLayout from "@/components/SearchableLayout";
import fetchBooks from "@/lib/fetchBooks";
import { BookData } from "@/types";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";

export default function Page() {
  const [books, setBooks] = useState<BookData[]>([]);
  const router = useRouter();
  const q = router.query.q;

  const fetchSEarchResult = async () => {
    const data = await fetchBooks(q as string);
    setBooks(data);
  };

  useEffect(() => {
    if (q) fetchSEarchResult();
  }, [q]);

  return (
    <div>
      {books.map((book) => (
        <BookItem key={book.id} {...book} />
      ))}
    </div>
  );
}

Page.getLayout = (page: ReactNode) => {
  return <SearchableLayout>{page}</SearchableLayout>;
};
