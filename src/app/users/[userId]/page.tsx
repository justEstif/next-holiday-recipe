import { getLoggedInUser, getUser, pbServer } from "@/lib/server/pb";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function Page({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const cookieStore = await cookies();
  const pb = await pbServer(cookieStore);
  const user = await getUser(pb, userId);
  const loggedInUser = await getLoggedInUser(pb);
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
