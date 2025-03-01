import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { Recipe } from "@/types/recipe";

export async function DELETE(request: Request) {
	try {
		const { id } = await request.json();
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
		const index = recipes.findIndex((recipe) => recipe.id === id);

		if (index === -1) {
			return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
		}

		// Remove the recipe
		recipes.splice(index, 1);

		// Replace the recipes array in the file content
		const newContent = content.replace(
			/export const recipes: Recipe\[\] = \[[\s\S]*?\];/,
			`export const recipes: Recipe[] = ${JSON.stringify(recipes, null, 2)};`,
		);

		await fs.writeFile(filePath, newContent, "utf8");
		return NextResponse.json({ success: true });
	} catch (error) {
		return NextResponse.json({ error: "Invalid request" }, { status: 400 });
	}
}
