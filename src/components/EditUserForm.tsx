"use client";
import { useActionState, useState } from "react";
import FormMessage from "./FormMessage";
import { IUser } from "@/types";
import { updateUser } from "@/actions";

export default function EditUserForm({ user }: { user: IUser }) {
	const [state, formAction] = useActionState(updateUser, {
		message: "",
		status: undefined as "success" | "error" | undefined,
		id: undefined as string | undefined,
	});
	const [oldPassword, setOldPassword] = useState("");
	const [password, setPassword] = useState("");
	const [passwordConfirm, setPasswordConfirm] = useState("");

	// Check if any password field has a value
	const isPasswordRequired =
		oldPassword.length > 0 || password.length > 0 || passwordConfirm.length > 0;

	return (
		<form action={formAction}>
			<label>
				Name
				<input
					id="name"
					name="name"
					placeholder="Full Name"
					type="text"
					defaultValue={user.name}
				/>
			</label>

			<label>
				Username
				<input
					id="username"
					name="username"
					placeholder="Username"
					type="text"
					defaultValue={user.username}
				/>
			</label>

			<label>
				Avatar
				<input id="avatar" name="avatar" type="file" />
			</label>

			<label>
				Email
				<input
					id="email"
					name="email"
					placeholder="Email"
					type="email"
					defaultValue={user.email}
				/>
			</label>

			<label>
				Old Password
				<input
					id="oldPassword"
					name="oldPassword"
					placeholder="Current Password"
					type="password"
					value={oldPassword}
					onChange={(e) => setOldPassword(e.target.value)}
					required={isPasswordRequired}
				/>
			</label>

			<label>
				Password
				<input
					id="password"
					name="password"
					placeholder="Password"
					minLength={8}
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required={isPasswordRequired}
				/>
			</label>
			<label>
				Confirm Password
				<input
					id="passwordConfirm"
					name="passwordConfirm"
					placeholder="Confirm Password"
					minLength={8}
					type="password"
					value={passwordConfirm}
					onChange={(e) => setPasswordConfirm(e.target.value)}
					required={isPasswordRequired}
				/>
			</label>
			<FormMessage message={state?.message} />
			<button type="submit">Edit Account</button>
		</form>
	);
}
