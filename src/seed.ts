import Client from "pocketbase";

const seedData = {
	users: [
		{
			id: "user1",
			name: "Alice Johnson",
			username: "alice_chef",
			email: "alice@example.com",
			password: "12345678",
		},
		{
			id: "user2",
			name: "Bob Smith",
			username: "bob_foodie",
			email: "bob@example.com",
			password: "12345678",
		},
		{
			id: "user3",
			name: "Carol Martinez",
			username: "carol_cook",
			email: "carol@example.com",
			password: "12345678",
		},
		{
			id: "user4",
			name: "David Wilson",
			username: "david_taste",
			email: "david@example.com",
			password: "12345678",
		},
		{
			id: "user5",
			name: "Eva Brown",
			username: "eva_kitchen",
			email: "eva@example.com",
			password: "12345678",
		},
		{
			id: "user6",
			name: "Frank Garcia",
			username: "frank_culinary",
			email: "frank@example.com",
			password: "12345678",
		},
		{
			id: "user7",
			name: "Grace Lee",
			username: "grace_gourmet",
			email: "grace@example.com",
			password: "12345678",
		},
		{
			id: "user8",
			name: "Henry Chen",
			username: "henry_recipes",
			email: "henry@example.com",
			password: "12345678",
		},
		{
			id: "user9",
			name: "Isabel Rodriguez",
			username: "isabel_flavor",
			email: "isabel@example.com",
			password: "12345678",
		},
		{
			id: "user10",
			name: "Jack Thompson",
			username: "jack_cuisine",
			email: "jack@example.com",
			password: "12345678",
		},
	],
	recipes: [
		{
			author: "user1",
			title: "Classic Spaghetti Carbonara",
			ingredients: [
				{ item: "spaghetti", quantity: "400g" },
				{ item: "pancetta", quantity: "200g" },
				{ item: "eggs", quantity: "4 large" },
				{ item: "Pecorino Romano", quantity: "100g" },
				{ item: "black pepper", quantity: "to taste" },
			],
			tags: ["italian", "pasta", "quick", "dinner"],
			steps: [
				"Bring a large pot of salted water to boil",
				"Cook spaghetti according to package instructions",
				"While pasta cooks, crisp pancetta in a large pan",
				"Beat eggs and cheese in a bowl",
				"Combine hot pasta with pancetta, then mix in egg mixture",
				"Season generously with black pepper and serve immediately",
			],
			published: true,
		},
		{
			author: "user2",
			title: "Thai Green Curry",
			ingredients: [
				{ item: "coconut milk", quantity: "400ml" },
				{ item: "green curry paste", quantity: "2 tbsp" },
				{ item: "chicken breast", quantity: "500g" },
				{ item: "bamboo shoots", quantity: "200g" },
				{ item: "thai basil", quantity: "1 handful" },
			],
			tags: ["thai", "spicy", "curry", "dinner"],
			steps: [
				"Heat coconut milk in a large pan",
				"Add curry paste and simmer until fragrant",
				"Add diced chicken and cook until done",
				"Add bamboo shoots and simmer",
				"Finish with thai basil and serve with rice",
			],
			published: true,
		},
		{
			author: "user3",
			title: "Vegan Buddha Bowl",
			ingredients: [
				{ item: "quinoa", quantity: "200g" },
				{ item: "sweet potato", quantity: "1 large" },
				{ item: "chickpeas", quantity: "400g can" },
				{ item: "kale", quantity: "200g" },
				{ item: "tahini", quantity: "2 tbsp" },
			],
			tags: ["vegan", "healthy", "bowl", "lunch"],
			steps: [
				"Cook quinoa according to package instructions",
				"Roast diced sweet potato with spices",
				"Drain and season chickpeas",
				"Massage kale with olive oil",
				"Arrange all components in bowls",
				"Drizzle with tahini dressing",
			],
			published: true,
		},
		{
			author: "user4",
			title: "Japanese Ramen",
			ingredients: [
				{ item: "ramen noodles", quantity: "200g" },
				{ item: "pork belly", quantity: "300g" },
				{ item: "soy sauce", quantity: "2 tbsp" },
				{ item: "mirin", quantity: "1 tbsp" },
				{ item: "eggs", quantity: "2" },
			],
			tags: ["japanese", "soup", "dinner", "comfort"],
			steps: [
				"Prepare broth with bones and vegetables",
				"Cook pork belly until tender",
				"Boil eggs for 6.5 minutes",
				"Cook noodles separately",
				"Assemble bowls with broth, noodles, meat, and toppings",
			],
			published: true,
		},
		{
			author: "user5",
			title: "Mediterranean Salad",
			ingredients: [
				{ item: "cucumber", quantity: "1 large" },
				{ item: "tomatoes", quantity: "4 medium" },
				{ item: "feta cheese", quantity: "200g" },
				{ item: "olives", quantity: "100g" },
				{ item: "olive oil", quantity: "3 tbsp" },
			],
			tags: ["mediterranean", "salad", "healthy", "lunch"],
			steps: [
				"Dice cucumber and tomatoes",
				"Slice olives",
				"Cube feta cheese",
				"Combine all ingredients",
				"Dress with olive oil and oregano",
			],
			published: true,
		},
		{
			author: "user6",
			title: "Mexican Street Tacos",
			ingredients: [
				{ item: "corn tortillas", quantity: "12 small" },
				{ item: "steak", quantity: "500g" },
				{ item: "onion", quantity: "1 medium" },
				{ item: "cilantro", quantity: "1 bunch" },
				{ item: "lime", quantity: "2" },
			],
			tags: ["mexican", "street food", "dinner", "spicy"],
			steps: [
				"Marinate steak with spices",
				"Grill steak to desired doneness",
				"Warm tortillas",
				"Dice onions and chop cilantro",
				"Assemble tacos and serve with lime wedges",
			],
			published: true,
		},
		{
			author: "user7",
			title: "French Onion Soup",
			ingredients: [
				{ item: "onions", quantity: "1kg" },
				{ item: "beef broth", quantity: "2L" },
				{ item: "baguette", quantity: "1" },
				{ item: "gruyere cheese", quantity: "200g" },
				{ item: "butter", quantity: "50g" },
			],
			tags: ["french", "soup", "winter", "comfort"],
			steps: [
				"Slowly caramelize onions until golden brown",
				"Add beef broth and simmer",
				"Toast baguette slices",
				"Top with cheese and gratinate",
				"Serve hot with extra cheese",
			],
			published: true,
		},
		{
			author: "user8",
			title: "Indian Butter Chicken",
			ingredients: [
				{ item: "chicken thighs", quantity: "800g" },
				{ item: "yogurt", quantity: "200g" },
				{ item: "tomato paste", quantity: "3 tbsp" },
				{ item: "heavy cream", quantity: "200ml" },
				{ item: "butter", quantity: "100g" },
			],
			tags: ["indian", "curry", "dinner", "creamy"],
			steps: [
				"Marinate chicken in spiced yogurt",
				"Cook chicken until done",
				"Prepare creamy tomato sauce",
				"Combine chicken with sauce",
				"Finish with butter and cream",
			],
			published: true,
		},
		{
			author: "user9",
			title: "Korean Bibimbap",
			ingredients: [
				{ item: "rice", quantity: "400g" },
				{ item: "ground beef", quantity: "300g" },
				{ item: "spinach", quantity: "200g" },
				{ item: "carrots", quantity: "2 medium" },
				{ item: "gochujang", quantity: "2 tbsp" },
			],
			tags: ["korean", "rice bowl", "dinner", "vegetables"],
			steps: [
				"Cook rice until fluffy",
				"Prepare seasoned vegetables",
				"Cook ground beef with seasonings",
				"Arrange all components over rice",
				"Serve with gochujang sauce",
			],
			published: true,
		},
		{
			author: "user10",
			title: "Classic Apple Pie",
			ingredients: [
				{ item: "apples", quantity: "1kg" },
				{ item: "pie crust", quantity: "2" },
				{ item: "cinnamon", quantity: "2 tsp" },
				{ item: "sugar", quantity: "200g" },
				{ item: "butter", quantity: "50g" },
			],
			tags: ["dessert", "american", "baking", "pie"],
			steps: [
				"Prepare pie crust",
				"Slice and season apples",
				"Fill pie with apple mixture",
				"Add top crust and vent",
				"Bake until golden brown",
			],
			published: true,
		},
	],
};

export async function seed(pb: Client) {
	try {
		console.log("Starting cleanup...");

		// Delete existing records
		try {
			const existingRecipes = await pb.collection("recipes").getFullList();
			for (const recipe of existingRecipes) {
				await pb.collection("recipes").delete(recipe.id);
			}

			const existingUsers = await pb.collection("users").getFullList();
			for (const user of existingUsers) {
				await pb.collection("users").delete(user.id);
			}

			console.log("✓ Cleanup completed");
		} catch (error) {
			console.error("× Cleanup failed");
			return;
		}

		// Create users
		console.log("Creating users...");
		for (const user of seedData.users) {
			await pb.collection("users").create({
				...user,
				emailVisibility: true,
				verified: true,
			});
		}
		console.log("✓ Users created");

		// Create recipes
		console.log("Creating recipes...");
		for (const recipe of seedData.recipes) {
			await pb.collection("recipes").create({
				...recipe,
				ingredients: JSON.stringify(recipe.ingredients),
				tags: JSON.stringify(recipe.tags),
				steps: JSON.stringify(recipe.steps),
			});
		}
		console.log("✓ Recipes created");

		console.log("✓ Seeding completed successfully!");
	} catch (error) {
		console.error("× Seeding failed:", error.message);
		// process.exit(1);
	}
}
