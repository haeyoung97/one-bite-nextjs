export default function Page({
  params,
}: {
  params: { id: string | string[] };
}) {
  return <div>영화 상세 페이지 {params.id}</div>;
}
