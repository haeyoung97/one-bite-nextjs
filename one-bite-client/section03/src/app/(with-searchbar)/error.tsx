"use client";
import { useRouter } from "next/navigation";
import { startTransition } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const router = useRouter();
  return (
    <div>
      <h3>오류가 발생했습니다.</h3>
      <button
        onClick={() => {
          startTransition(() => {
            // 하위의 두개 단계가 순차적으로 모두 이루어져야 에러에서 벗어날 수 있다.
            router.refresh(); // 현재 페이지에 필요한 서버 컴포넌트를 Next 서버에 다시 실행해달라고 요청하는 행위. 비동기 메소드
            reset(); // 에러 상태를 초기화, 컴포넌트들을 다시 렌더링
          });
        }}
      >
        다시 시도
      </button>
    </div>
  );
}
