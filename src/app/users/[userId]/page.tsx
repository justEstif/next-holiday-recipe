import { pbServer, User } from "@/lib/pb";
import { cookies } from "next/headers";
import Link from "next/link";

async function getUser(userId: string) {
  try {
    const cookieStore = await cookies();
    const pb = await pbServer(cookieStore);

    const userData = await pb.collection("users").getOne<User>(userId, {
      expand: "relField1,relField2.subRelField",
    });
    return userData;
  } catch (error) {
    console.error("Error fetching user data", error);
    return null;
  }
}

async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const pb = await pbServer(cookieStore);
    const currentUser = pb.authStore.model;
    return currentUser;
  } catch (error) {
    console.error("Error fetching current user", error);
    return null;
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const user = await getUser(userId);
  const currentUser = await getCurrentUser();

  const canEdit = currentUser?.id === userId;

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
