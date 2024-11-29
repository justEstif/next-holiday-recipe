export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  return (
    <section className="container">
      <h1>Recipe - {slug}</h1>
    </section>
  );
}
