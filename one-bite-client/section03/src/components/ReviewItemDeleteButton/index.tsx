"use client";

import { deleteReviewAction } from "@/actions/deleteReviewAction";
import { useActionState, useEffect, useRef } from "react";
import style from "./index.module.css";

export default function ReviewItemDeleteButton({
  bookId,
  reviewId,
}: {
  bookId: number;
  reviewId: number;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(
    deleteReviewAction,
    null
  );

  useEffect(() => {
    if (state && !state.status) alert(state.error);
  }, [state]);

  return (
    <form ref={formRef} action={formAction}>
      <input name="bookId" value={bookId} hidden />
      <input name="reviewId" value={reviewId} hidden />
      {isPending ? (
        <div className={style.delete_btn}>...</div>
      ) : (
        <div
          className={style.delete_btn}
          onClick={() => formRef.current?.requestSubmit()}
        >
          삭제하기
        </div>
      )}
    </form>
  );
}
