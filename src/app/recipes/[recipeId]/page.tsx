export default async function Page({
  params,
}: {
  params: Promise<{ recipeId: string }>;
}) {
  const { recipeId } = await params;

  return (
    <section className="container">
      <h1>Recipe - {recipeId}</h1>
    </section>
  );
}
