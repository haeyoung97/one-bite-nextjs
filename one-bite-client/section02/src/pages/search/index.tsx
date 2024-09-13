import BookItem from "@/components/BookItem";
import SearchableLayout from "@/components/SearchableLayout";
import books from "@/mock/books.json";
import { ReactNode } from "react";

export default function Page() {
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
