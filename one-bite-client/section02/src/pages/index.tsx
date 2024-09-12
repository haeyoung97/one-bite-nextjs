import SearchableLayout from "@/components/SearchableLayout";
import { ReactNode } from "react";

export default function Home() {
  return <></>;
}

/**
 * @description javascript 의 모든 함수는 객체이므로 메소드를 추가할 수 있다.
 */
Home.getLayout = (page: ReactNode) => {
  return <SearchableLayout>{page}</SearchableLayout>;
};
