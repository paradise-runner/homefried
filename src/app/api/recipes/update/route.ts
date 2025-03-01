import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { Recipe } from "@/types/recipe";
import { writeFile } from "fs/promises";
import { join } from "path";

export async function PUT(request: Request) {
	// try {
	const formData = await request.formData();
	const recipeJson = formData.get("recipe") as string;
	const image = formData.get("image") as File;

	const recipe: Recipe = JSON.parse(recipeJson);
	const filePath = path.join(process.cwd(), "src/data/recipes.ts");

	// Read the current file content
	let content = await fs.readFile(filePath, "utf8");

	// Parse the recipes array from the file content
	const recipesMatch = content.match(
		/export const recipes: Recipe\[\] = (\[[\s\S]*?\]);/,
	);
	if (!recipesMatch) {
		return NextResponse.json(
			{ error: "Failed to parse recipes" },
			{ status: 500 },
		);
	}

	const recipes: Recipe[] = eval(recipesMatch[1]);
	const index = recipes.findIndex((r) => r.id === recipe.id);

	if (index === -1) {
		return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
	}

	// Update the recipe
	recipes[index] = recipe;

	// Replace the recipes array in the file content
	const newContent = content.replace(
		/export const recipes: Recipe\[\] = \[[\s\S]*?\];/,
		`export const recipes: Recipe[] = ${JSON.stringify(recipes, null, 2)};`,
	);

	await fs.writeFile(filePath, newContent, "utf8");

	if (image) {
		const bytes = await image.arrayBuffer();
		const buffer = Buffer.from(bytes);
		const imagePath = join(
			process.cwd(),
			"public/recipe-images",
			`${recipe.id}.jpg`,
		);
		await writeFile(imagePath, buffer);
	}

	return NextResponse.json(recipe);
	// } catch (error) {
	// 	console.error('Update error:', error);
	// 	return NextResponse.json({ error: "Invalid request" }, { status: 400 });
	// }
}
