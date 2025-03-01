"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

function SearchParamsProvider({
	children,
}: { children: (editId: string | null) => React.ReactNode }) {
	const searchParams = useSearchParams();
	const editId = searchParams.get("edit");
	return <>{children(editId)}</>;
}

function RecipeForm({ editId }: { editId: string | null }) {
	const router = useRouter();

	const [formData, setFormData] = useState({
		title: "",
		description: "",
		cuisine: "",
		duration: "",
		difficulty: "Easy",
	});
	const [ingredients, setIngredients] = useState<string[]>([""]);
	const [instructions, setInstructions] = useState<string[]>([""]);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (editId) {
			// Fetch recipe data if in edit mode
			fetch(`/api/recipes/${editId}`)
				.then((res) => res.json())
				.then((recipe) => {
					setFormData({
						title: recipe.title,
						description: recipe.description,
						cuisine: recipe.cuisine,
						duration: recipe.duration,
						difficulty: recipe.difficulty,
					});
					setIngredients(recipe.ingredients);
					setInstructions(recipe.instructions);
					// Add image preview if exists
					setImagePreview(`/recipe-images/${editId}.jpg`);
				});
		}
	}, [editId]);

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const formDataObj = new FormData();

		const recipeData: {
			id?: string;
			title: string;
			description: string;
			cuisine: string;
			duration: string;
			difficulty: string;
			ingredients: string[];
			instructions: string[];
		} = {
			title: formData.title,
			description: formData.description,
			cuisine: formData.cuisine,
			duration: formData.duration,
			difficulty: formData.difficulty,
			ingredients: ingredients.filter((i) => i.trim()),
			instructions: instructions.filter((i) => i.trim()),
		};

		if (editId) {
			// Include the ID when editing
			recipeData.id = editId;
		}

		formDataObj.append("recipe", JSON.stringify(recipeData));

		if (fileInputRef.current?.files?.[0]) {
			formDataObj.append("image", fileInputRef.current.files[0]);
		}

		const endpoint = editId ? `/api/recipes/update` : `/api/recipes/create`;
		const method = editId ? "PUT" : "POST";

		try {
			const response = await fetch(endpoint, {
				method,
				body: formDataObj,
			});

			if (response.ok) {
				router.push("/recipes");
			} else {
				console.error("Failed to submit recipe:", await response.text());
			}
		} catch (error) {
			console.error("Failed to submit recipe:", error);
		}
	};

	return (
		<div className="container mx-auto py-6 px-4 sm:py-8 sm:px-6 max-w-5xl">
			<h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
				{editId ? "Edit" : "Submit"} Recipe
			</h1>
			<form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
				<div>
					<label className="block mb-2">Title</label>
					<Input
						type="text"
						required
						value={formData.title}
						onChange={(e) =>
							setFormData({ ...formData, title: e.target.value })
						}
					/>
				</div>

				<div>
					<label className="block mb-2">Description</label>
					<Textarea
						required
						value={formData.description}
						onChange={(e) =>
							setFormData({ ...formData, description: e.target.value })
						}
					/>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div>
						<label className="block mb-2">Cuisine</label>
						<Input
							type="text"
							required
							value={formData.cuisine}
							onChange={(e) =>
								setFormData({ ...formData, cuisine: e.target.value })
							}
						/>
					</div>
					<div>
						<label className="block mb-2">Duration</label>
						<Input
							type="text"
							required
							placeholder="e.g., 30 mins"
							value={formData.duration}
							onChange={(e) =>
								setFormData({ ...formData, duration: e.target.value })
							}
						/>
					</div>
				</div>

				<div>
					<label className="block mb-2">Difficulty</label>
					<Select
						value={formData.difficulty}
						onValueChange={(value) =>
							setFormData({ ...formData, difficulty: value })
						}
					>
						<SelectTrigger>
							<SelectValue placeholder="Select difficulty" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="Easy">Easy</SelectItem>
							<SelectItem value="Medium">Medium</SelectItem>
							<SelectItem value="Hard">Hard</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div>
					<label className="block mb-2">Ingredients</label>
					{ingredients.map((ingredient, index) => (
						<div key={index} className="mb-2 flex gap-2">
							<Input
								type="text"
								required
								value={ingredient}
								onChange={(e) => {
									const newIngredients = [...ingredients];
									newIngredients[index] = e.target.value;
									setIngredients(newIngredients);
								}}
							/>
							{index > 0 && (
								<Button
									type="button"
									variant="outline"
									size="icon"
									className="shrink-0"
									onClick={() => {
										const newIngredients = ingredients.filter(
											(_, i) => i !== index,
										);
										setIngredients(newIngredients);
									}}
								>
									×
								</Button>
							)}
						</div>
					))}
					<Button
						type="button"
						variant="outline"
						className="w-full sm:w-auto"
						onClick={() => setIngredients([...ingredients, ""])}
					>
						Add Ingredient
					</Button>
				</div>

				<div>
					<label className="block mb-2">Instructions</label>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{instructions.map((instruction, index) => (
							<div key={index} className="mb-2">
								<Textarea
									required
									value={instruction}
									onChange={(e) => {
										const newInstructions = [...instructions];
										newInstructions[index] = e.target.value;
										setInstructions(newInstructions);
									}}
								/>
							</div>
						))}
					</div>
					<Button
						type="button"
						variant="outline"
						className="mt-4"
						onClick={() => setInstructions([...instructions, ""])}
					>
						Add Instruction
					</Button>
				</div>

				<div>
					<label className="block mb-2">Recipe Image</label>
					<div className="space-y-4">
						{imagePreview && (
							<div className="aspect-video relative max-w-2xl">
								<img
									src={imagePreview}
									alt="Recipe preview"
									className="object-cover rounded-md w-full h-full"
								/>
							</div>
						)}
						<Input
							ref={fileInputRef}
							type="file"
							accept="image/*"
							onChange={handleImageChange}
						/>
					</div>
				</div>

				<Button type="submit" className="w-full sm:w-auto">
					{editId ? "Update" : "Submit"} Recipe
				</Button>
			</form>
		</div>
	);
}

export default function SubmitRecipe() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<SearchParamsProvider>
				{(editId) => <RecipeForm editId={editId} />}
			</SearchParamsProvider>
		</Suspense>
	);
}
