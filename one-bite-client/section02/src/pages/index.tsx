import BookItem from "@/components/BookItem";
import SearchableLayout from "@/components/SearchableLayout";
import books from "@/mock/books.json";
import { ReactNode } from "react";
import style from "./index.module.css";

export default function Home() {
  return (
    <div className={style.container}>
      <section>
        <h3>지금 추천하는 도서</h3>
        {books.map((book) => (
          <BookItem key={book.id} {...book} />
        ))}
      </section>
      <section>
        <h3>등록된 모든 도서</h3>
        {books.map((book) => (
          <BookItem key={book.id} {...book} />
        ))}
      </section>
    </div>
  );
}

/**
 * @description javascript 의 모든 함수는 객체이므로 메소드를 추가할 수 있다.
 */
Home.getLayout = (page: ReactNode) => {
  return <SearchableLayout>{page}</SearchableLayout>;
};
