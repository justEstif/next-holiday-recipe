import { pbServer } from "@/lib/server/pb";
import type { IUser } from "@/types";
import { cookies } from "next/headers";

async function getUser(userId: string) {
	try {
		const cookieStore = await cookies();
		const pb = await pbServer(cookieStore);

		const userData = await pb.collection("users").getOne<IUser>(userId, {
			expand: "relField1,relField2.subRelField",
		});
		return userData;
	} catch (error) {
		console.error("Error getting user", error);
		return null;
	}
}

// TODO create update user option
async function updateUser(userId: string, data: Partial<IUser>) {
	try {
		const cookieStore = await cookies();
		const pb = await pbServer(cookieStore);
		const updatedUserData = await pb
			.collection("users")
			.update<IUser>(userId, data);
		return updatedUserData;
	} catch (error) {
		console.error("Error updating user", error);
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

	return (
		<section className="container">
			<h1>Editing Profile</h1>
			<form />
		</section>
	);
}
