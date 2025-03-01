"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import { recipes } from "@/data/recipes";
import { useState } from "react";
import { Trash2, Pencil } from "lucide-react";

export default function RecipesPage() {
	const [searchQuery, setSearchQuery] = useState("");
	const [filteredRecipes, setFilteredRecipes] = useState(recipes);
	const [recipeToDelete, setRecipeToDelete] = useState<string | null>(null);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

	const handleSearch = () => {
		const results = recipes.filter((recipe) =>
			recipe.title.toLowerCase().includes(searchQuery.toLowerCase()),
		);
		setFilteredRecipes(results);
	};

	const handleDelete = async (id: string) => {
		try {
			const response = await fetch("/api/recipes/delete", {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ id }),
			});

			if (response.ok) {
				const newRecipes = filteredRecipes.filter((recipe) => recipe.id !== id);
				setFilteredRecipes(newRecipes);
			}
		} catch (error) {
			console.error("Failed to delete recipe:", error);
		}
	};

	return (
		<div className="container mx-auto py-6 px-4 sm:py-10 sm:px-6 space-y-6 sm:space-y-8">
			<div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
				<Input
					className="w-full sm:max-w-sm"
					placeholder="Search recipes..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					onKeyDown={(e) => e.key === "Enter" && handleSearch()}
				/>
					<Button className="w-full sm:w-auto" onClick={handleSearch}>Search</Button>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
				{filteredRecipes.map((recipe) => (
					<div key={recipe.id} className="relative group">
						<Link href={`/recipes/${recipe.id}`} className="h-full block">
							<Card className="hover:shadow-lg transition-shadow h-full flex flex-col">
								<CardHeader>
									<CardTitle>{recipe.title}</CardTitle>
								</CardHeader>
								<CardContent className="flex-grow">
									<div className="aspect-video bg-muted rounded-md relative overflow-hidden">
										<img
											src={`/recipe-images/${recipe.id}.jpg`}
											alt={recipe.title}
											className="object-cover w-full h-full"
										/>
									</div>
								</CardContent>
							</Card>
						</Link>
						<div className="absolute top-2 right-2 space-x-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
							<Link
								href={`/submit?edit=${recipe.id}`}
								onClick={(e) => e.stopPropagation()}
							>
								<Button variant="secondary" size="icon">
									<Pencil className="h-4 w-4" />
								</Button>
							</Link>
							<Button
								variant="destructive"
								size="icon"
								onClick={(e) => {
									e.preventDefault();
									setRecipeToDelete(recipe.id);
									setIsDeleteDialogOpen(true);
								}}
							>
								<Trash2 className="h-4 w-4" />
							</Button>
						</div>
					</div>
				))}
			</div>

			<AlertDialog
				open={isDeleteDialogOpen}
				onOpenChange={setIsDeleteDialogOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete the
							recipe.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={() => setRecipeToDelete(null)}>
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={() => {
								if (recipeToDelete) {
									handleDelete(recipeToDelete);
									setIsDeleteDialogOpen(false);
									setRecipeToDelete(null);
								}
							}}
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
