"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Edit2, Check, Loader2 } from "lucide-react";
import { recipes } from "@/data/recipes";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";

interface SelectedRecipe {
	id: string;
	title: string;
	ingredients: string[];
}

interface CategorizedIngredient {
	ingredient: string;
	category: string;
}

export default function ShoppingListPage() {
	const [selectedRecipes, setSelectedRecipes] = useState<SelectedRecipe[]>([]);
	const [isEditMode, setIsEditMode] = useState(false);
	const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
	const [categorizedIngredients, setCategorizedIngredients] = useState<
		CategorizedIngredient[]
	>([]);
	const [isLoading, setIsLoading] = useState(false);

	const addRecipeToList = (recipe: (typeof recipes)[0]) => {
		if (!selectedRecipes.some((r) => r.id === recipe.id)) {
			setSelectedRecipes([...selectedRecipes, recipe]);
		}
	};

	const removeRecipeFromList = (recipeId: string) => {
		setSelectedRecipes(
			selectedRecipes.filter((recipe) => recipe.id !== recipeId),
		);
	};

	const getAllIngredients = () => {
		return selectedRecipes.reduce((acc, recipe) => {
			return [...acc, ...recipe.ingredients];
		}, [] as string[]);
	};

	const toggleEditMode = () => {
		setIsEditMode(!isEditMode);
		setSelectedIngredients([]);
	};

	const toggleIngredientSelection = (ingredient: string) => {
		setSelectedIngredients((prev) =>
			prev.includes(ingredient)
				? prev.filter((i) => i !== ingredient)
				: [...prev, ingredient],
		);
	};

	const removeSelectedIngredients = () => {
		setSelectedRecipes((prev) =>
			prev.map((recipe) => ({
				...recipe,
				ingredients: recipe.ingredients.filter(
					(ingredient) => !selectedIngredients.includes(ingredient),
				),
			})),
		);
		setSelectedIngredients([]);
		setIsEditMode(false);
	};

	const categorizeIngredients = async (ingredients: string[]) => {
		setIsLoading(true);
		try {
			const response = await fetch("/api/categorize", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ ingredients }),
			});
			const data = await response.json();
			setCategorizedIngredients(data.categorized);
		} catch (error) {
			console.error("Error categorizing ingredients:", error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		const ingredients = getAllIngredients();
		if (ingredients.length > 0) {
			categorizeIngredients(ingredients);
		} else {
			setCategorizedIngredients([]);
		}
	}, [selectedRecipes]);

	const getGroupedIngredients = () => {
		return categorizedIngredients.reduce(
			(acc, { ingredient, category }) => {
				if (!acc[category]) {
					acc[category] = [];
				}
				acc[category].push(ingredient);
				return acc;
			},
			{} as Record<string, string[]>,
		);
	};

	const groupedIngredients = getGroupedIngredients();

	return (
		<div className="container mx-auto py-6 px-4 sm:py-10 sm:px-6 space-y-6">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div>
					<h2 className="text-2xl font-bold mb-4">Available Recipes</h2>
					<div className="space-y-4">
						{recipes.map((recipe) => (
							<Card
								key={recipe.id}
								className="cursor-pointer hover:shadow-md transition-shadow"
							>
								<CardHeader
									className="p-4"
									onClick={() => addRecipeToList(recipe)}
								>
									<CardTitle className="text-lg">{recipe.title}</CardTitle>
								</CardHeader>
							</Card>
						))}
					</div>
				</div>

				<div>
					<div className="flex justify-between items-center mb-4">
						<h2 className="text-2xl font-bold">Shopping List</h2>
						{selectedRecipes.length > 0 && (
							<div className="space-x-2">
								{isEditMode ? (
									<>
										<Button
											variant="destructive"
											onClick={removeSelectedIngredients}
											disabled={selectedIngredients.length === 0}
										>
											Remove Selected
										</Button>
										<Button variant="outline" onClick={toggleEditMode}>
											<Check className="h-4 w-4 mr-2" />
											Done
										</Button>
									</>
								) : (
									<Button variant="outline" onClick={toggleEditMode}>
										<Edit2 className="h-4 w-4 mr-2" />
										Edit
									</Button>
								)}
							</div>
						)}
					</div>

					{selectedRecipes.length > 0 ? (
						<div className="space-y-6">
							<div className="space-y-2">
								<h3 className="text-lg font-semibold">Selected Recipes:</h3>
								{selectedRecipes.map((recipe) => (
									<div
										key={recipe.id}
										className="flex items-center justify-between bg-muted p-2 rounded"
									>
										<span>{recipe.title}</span>
										<Button
											variant="ghost"
											size="sm"
											onClick={() => removeRecipeFromList(recipe.id)}
										>
											<X className="h-4 w-4" />
										</Button>
									</div>
								))}
							</div>

							<div>
								<h3 className="text-lg font-semibold mb-2">Ingredients:</h3>
								{isLoading ? (
									<div className="space-y-4">
										<div className="flex items-center space-x-2">
											<Loader2 className="h-4 w-4 animate-spin" />
											<span className="text-sm text-muted-foreground">
												Categorizing ingredients with local AI...
											</span>
										</div>
										{[1, 2, 3].map((i) => (
											<div key={i} className="space-y-2">
												<Skeleton className="h-4 w-24" />
												<Skeleton className="h-4 w-full" />
												<Skeleton className="h-4 w-full" />
											</div>
										))}
									</div>
								) : (
									Object.entries(groupedIngredients).map(
										([category, ingredients]) => (
											<div key={category} className="mb-4">
												<h4 className="font-medium text-muted-foreground mb-2">
													{category}
												</h4>
												<ul className="list-disc pl-6 space-y-1">
													{ingredients.map((ingredient, index) => (
														<li key={index} className="flex items-center gap-2">
															{isEditMode && (
																<Checkbox
																	checked={selectedIngredients.includes(
																		ingredient,
																	)}
																	onCheckedChange={() =>
																		toggleIngredientSelection(ingredient)
																	}
																/>
															)}
															{ingredient}
														</li>
													))}
												</ul>
											</div>
										),
									)
								)}
							</div>
						</div>
					) : (
						<Card>
							<CardContent className="p-4 text-center text-muted-foreground">
								Select recipes to build your shopping list
							</CardContent>
						</Card>
					)}
				</div>
			</div>
		</div>
	);
}
