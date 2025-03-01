import type { Recipe } from "@/types/recipe";
import { recipes } from "@/data/recipes";

export function getRecipe(id: string): Recipe | undefined {
	return recipes.find((recipe) => recipe.id === id);
}

export function getFeaturedRecipes(): Recipe[] {
	return recipes.slice(0, 3);
}

export function getCategories(): string[] {
	const categories = recipes.map((recipe) => recipe.cuisine);
	return [...new Set(categories)];
}

export function getRecipesByCategory(category: string): Recipe[] {
	return recipes.filter((recipe) => recipe.cuisine === category);
}

export function addRecipe(recipe: Omit<Recipe, "id">): Recipe {
	const newRecipe = {
		...recipe,
		id: (recipes.length + 1).toString(),
	};
	recipes.push(newRecipe);
	return newRecipe;
}

export function getAllRecipes(): Recipe[] {
	// Return all recipes from your data source
	return recipes;
}