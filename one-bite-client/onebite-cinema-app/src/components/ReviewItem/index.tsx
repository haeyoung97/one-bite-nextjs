import { ReviewData } from "@/types";
import style from "./index.module.css";

export default function ReviewItem({
  id,
  content,
  author,
  createdAt,
}: ReviewData) {
  return (
    <div className={style.container}>
      <div className={style.top_container}>
        <div className={style.author}>{author}</div>
        <div className={style.date}>{new Date(createdAt).toLocaleString()}</div>
      </div>
      <div className={style.content}>{content}</div>
      <div className={style.delete_btn}>🗑️ 리뷰 삭제하기</div>
    </div>
  );
}
