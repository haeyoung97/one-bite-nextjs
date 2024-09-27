import MovieItemSkeleton from "../MovieItemSkeleton";

export default function MovieListSkeleton({ count }: { count: number }) {
  return new Array(count)
    .fill(0)
    .map((_, idx) => <MovieItemSkeleton key={`movie-item-skeleton-${idx}`} />);
}
