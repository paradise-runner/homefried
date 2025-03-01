import Link from "next/link";
import { getRecipesByCategory } from "@/lib/recipes";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

type PageProps = {
	params: Promise<{
		category: string;
	}>;
};

export default async function CategoryPage({ params }: PageProps) {
	const { category } = await params;
	const recipes = getRecipesByCategory(category);

	return (
		<div className="container mx-auto py-6 px-4 sm:py-8 sm:px-6 space-y-4 sm:space-y-6">
			<Button variant="ghost" asChild className="pl-0">
				<Link href="/categories">
					<ChevronLeft className="mr-2 h-4 w-4" />
					<span className="sm:inline">Back to Categories</span>
				</Link>
			</Button>

			<div>
				<h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
					{category} Recipes
				</h1>
			</div>

			{recipes.length ? (
				<div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
					{recipes.map((recipe) => (
						<Link href={`/recipes/${recipe.id}`} key={recipe.id}>
							<Card className="h-full transition-colors hover:bg-muted/50">
								<CardHeader>
									<CardTitle>{recipe.title}</CardTitle>
								</CardHeader>
							</Card>
						</Link>
					))}
				</div>
			) : (
				<div className="text-muted-foreground">
					No recipes found for this category.
				</div>
			)}
		</div>
	);
}
