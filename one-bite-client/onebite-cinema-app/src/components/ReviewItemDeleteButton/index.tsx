"use client";

import { deleteReviewAction } from "@/actions/deleteReviewAction";
import { useActionState, useEffect, useRef } from "react";
import style from "./index.module.css";

export default function ReviewItemDeleteButton({
  movieId,
  reviewId,
}: {
  movieId: number;
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
      <input name="movieId" value={movieId} hidden />
      <input name="reviewId" value={reviewId} hidden />
      {isPending ? (
        <div className={style.delete_btn}>🗑️ 리뷰 삭제 ...</div>
      ) : (
        <div
          className={style.delete_btn}
          onClick={() => formRef.current?.requestSubmit()}
        >
          🗑️ 리뷰 삭제하기
        </div>
      )}
    </form>
  );
}
