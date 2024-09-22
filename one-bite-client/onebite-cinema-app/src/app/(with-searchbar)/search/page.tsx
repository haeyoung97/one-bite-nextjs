export default function Page({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  return <div>Search: {searchParams.q}</div>;
}
