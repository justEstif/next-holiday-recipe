import { getLoggedInUser, getUser } from "@/lib/server/pb";
import Link from "next/link";

export default async function Page({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const user = await getUser(userId);
  const loggedInUser = await getLoggedInUser();
  const canEdit = user && loggedInUser && loggedInUser.id === user.id;

  return (
    <section className="container">
      <h1>User - {user?.username}</h1>
      {canEdit && (
        <Link href={`/user/${userId}/edit`}>
          <button>Edit Profile</button>
        </Link>
      )}
    </section>
  );
}
