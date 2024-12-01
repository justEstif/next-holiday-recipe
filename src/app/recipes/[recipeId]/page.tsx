export default async function Page({
  params,
}: {
  params: Promise<{ recipeId: string }>;
}) {
  const slug = (await params).recipeId;
  return (
    <section className="container">
      <h1>Recipe - {slug}</h1>
    </section>
  );
}
