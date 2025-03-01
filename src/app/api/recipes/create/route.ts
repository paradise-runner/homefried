import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { Recipe } from "@/types/recipe";
import { v4 as uuidv4 } from "uuid";
import { writeFile } from "fs/promises";
import { join } from "path";

export async function POST(request: Request) {
	try {
		const formData = await request.formData();
		const recipeJson = formData.get("recipe") as string;
		const image = formData.get("image") as File;

		const recipe: Omit<Recipe, "id"> = JSON.parse(recipeJson);
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

		// Create new recipe with generated ID
		const newRecipe: Recipe = {
			...recipe,
			id: uuidv4(),
		};

		// Add the new recipe
		recipes.push(newRecipe);

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
				`${newRecipe.id}.jpg`,
			);
			await writeFile(imagePath, buffer);
		}

		return NextResponse.json(newRecipe);
	} catch (error) {
		return NextResponse.json({ error: "Invalid request" }, { status: 400 });
	}
}
