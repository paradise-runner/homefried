import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getRecipe } from "@/lib/recipes";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Pencil } from "lucide-react";

type Params = { id: string };

export default async function RecipePage({
	params,
}: { params: Promise<Params> }) {
	const { id } = await params;
	const recipe = getRecipe(id);

	if (!recipe) {
		notFound();
	}

	return (
		<div className="container mx-auto py-6 md:py-10 px-4 md:px-6">
			<div className="flex justify-between items-center mb-6">
				<Link
					href="/recipes"
					className="inline-flex items-center hover:text-primary"
				>
					<ArrowLeft className="w-4 h-4 mr-2" />
					Back to Recipes
				</Link>
				<Link href={`/submit?edit=${id}`}>
					<Button variant="outline" className="flex items-center gap-2">
						<Pencil className="h-4 w-4" />
						Edit Recipe
					</Button>
				</Link>
			</div>

			<Card className="overflow-hidden">
				<CardHeader className="md:flex md:flex-row md:items-start md:gap-6">
					<div className="md:flex-1">
						<CardTitle className="text-2xl md:text-4xl mb-4">
							{recipe.title}
						</CardTitle>
						<div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
							<div className="flex items-center gap-2">
								<span className="font-medium">Cuisine:</span> {recipe.cuisine}
							</div>
							<div className="flex items-center gap-2">
								<span className="font-medium">Duration:</span> {recipe.duration}
							</div>
							<div className="flex items-center gap-2">
								<span className="font-medium">Difficulty:</span>{" "}
								{recipe.difficulty}
							</div>
						</div>
					</div>
					<div className="md:w-1/2 rounded-lg overflow-hidden">
						<img
							src={`/recipe-images/${id}.jpg`}
							alt={recipe.title}
							className="object-cover w-full aspect-video"
							loading="lazy"
						/>
					</div>
				</CardHeader>

				<CardContent className="md:grid md:grid-cols-2 md:gap-8">
					<div className="space-y-6 mb-8 md:mb-0">
						<div>
							<h2 className="text-xl md:text-2xl font-semibold mb-4">
								Ingredients
							</h2>
							<ul className="space-y-2">
								{recipe.ingredients.map((ingredient, i) => (
									<li key={i} className="flex gap-2">
										<span className="text-primary">•</span>
										<span>{ingredient}</span>
									</li>
								))}
							</ul>
						</div>
					</div>

					<div className="space-y-6">
						<div>
							<h2 className="text-xl md:text-2xl font-semibold mb-4">
								Instructions
							</h2>
							<ol className="space-y-4">
								{recipe.instructions.map((instruction, i) => (
									<li key={i} className="flex gap-3">
										<span className="font-medium text-primary">{i + 1}.</span>
										<span>{instruction}</span>
									</li>
								))}
							</ol>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
