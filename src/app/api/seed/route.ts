// app/api/seed/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { pbServer } from "@/lib/server/pb";
import seedData from "./seed.json";

export async function POST(req: NextRequest) {
	try {
		// Get admin credentials from environment variables
		const adminEmail = process.env.ADMIN_EMAIL;
		const adminPassword = process.env.ADMIN_PASSWORD;

		if (!adminEmail || !adminPassword) {
			return NextResponse.json(
				{ error: "Admin credentials not configured" },
				{ status: 500 },
			);
		}

		const cookieStore = await cookies();
		const pb = await pbServer(cookieStore);

		// Authenticate as admin
		const authData = await pb
			.collection("users")
			.authWithPassword(adminEmail, adminPassword);

		if (!authData) {
			return NextResponse.json(
				{ error: "Failed to authenticate as admin" },
				{ status: 401 },
			);
		}

		const results = [];
		const errors = [];

		// Create each recipe
		for (const recipe of seedData.recipes) {
			try {
				const recipeData = {
					...recipe,
					author: authData.record.id,
					// Convert arrays to JSON strings as required by PocketBase
					ingredients: JSON.stringify(recipe.ingredients),
					steps: JSON.stringify(recipe.steps),
					tags: JSON.stringify(recipe.tags),
				};

				const newRecipe = await pb.collection("recipes").create(recipeData);
				results.push(newRecipe);
			} catch (error) {
				errors.push({
					recipe: recipe.title,
					error: error instanceof Error ? error.message : "Unknown error",
				});
			}
		}

		return NextResponse.json({
			message: "Seeding completed",
			success: results.length,
			errors: errors.length > 0 ? errors : undefined,
		});
	} catch (error) {
		console.error("Seeding error:", error);
		return NextResponse.json(
			{ error: "Failed to seed database" },
			{ status: 500 },
		);
	}
}
