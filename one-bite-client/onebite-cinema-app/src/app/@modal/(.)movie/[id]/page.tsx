import MoviePage from "@/app/movie/[id]/page";
import Modal from "@/components/Modal";

export default function Page(props: any) {
  return (
    <Modal>
      <MoviePage {...props} />
    </Modal>
  );
}
