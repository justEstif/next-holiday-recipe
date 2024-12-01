import { pbServer, User } from "@/lib/pb";
import { cookies } from "next/headers";

async function getUser(userId: string) {
  try {
    const cookieStore = await cookies();
    const pb = await pbServer(cookieStore);

    const userData = await pb.collection("users").getOne<User>(userId, {
      expand: "relField1,relField2.subRelField",
    });
    return userData
  } catch (error) {
    console.error("Error fetching user data", error);
    return null
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const user = await getUser(userId);

  return (
    <section className="container">
      <h1>User - {user?.username}</h1>
    </section>
  );
}
