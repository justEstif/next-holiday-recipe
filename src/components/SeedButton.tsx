"use client";

import { useState } from "react";

export default function SeedButton() {
	const [isSeeding, setIsSeeding] = useState(false);
	const [message, setMessage] = useState("");

	const handleSeed = async () => {
		try {
			setIsSeeding(true);
			setMessage("");

			const response = await fetch("/api/seed", {
				method: "POST",
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Failed to seed database");
			}

			setMessage(`Successfully added ${data.success} recipes`);
			// Reload the page to show new recipes
			window.location.reload();
		} catch (error) {
			setMessage(
				error instanceof Error ? error.message : "Failed to seed database",
			);
		} finally {
			setIsSeeding(false);
		}
	};

	return (
		<div>
			<button onClick={handleSeed} disabled={isSeeding}>
				{isSeeding ? "Seeding..." : "Seed Recipe Database"}
			</button>
			{message && <p>{message}</p>}
		</div>
	);
}
