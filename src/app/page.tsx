import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { getFeaturedRecipes } from "@/lib/recipes";
import {
	BookOpen,
	FolderKanban,
	PlusCircle,
	Calendar,
	ListChecks,
} from "lucide-react";

export default function Home() {
	const featuredRecipes = getFeaturedRecipes();

	return (
		<div className="min-h-screen">
			<main className="container mx-auto py-6 px-4 sm:py-10 sm:px-6 space-y-8">
				<div className="text-center space-y-3 sm:space-y-4">
					<h1 className="text-3xl sm:text-4xl font-bold">HomeFried</h1>
					<p className="text-lg sm:text-xl text-muted-foreground">
						Discover and share delicious recipes
					</p>
				</div>

				<section className="max-w-3xl mx-auto">
					<Link href="/meal-planner" className="block">
						<Card className="hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-950 dark:to-rose-900 border-rose-200 dark:border-rose-800">
							<CardHeader className="text-center">
								<CardTitle className="flex items-center justify-center gap-3 text-2xl">
									<Calendar className="h-8 w-8 text-rose-600 dark:text-rose-400" />
									Weekly Meal Planner
								</CardTitle>
								<CardDescription className="text-rose-600/80 dark:text-rose-400/80 text-lg">
									Plan your meals for the week ahead
								</CardDescription>
							</CardHeader>
						</Card>
					</Link>
				</section>

				<section className="space-y-4">
					<h2 className="text-xl sm:text-2xl font-semibold text-center">
						Quick Navigation
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
						<Link href="/recipes" className="h-full">
							<Card className="hover:shadow-lg transition-all duration-300 h-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
								<CardHeader>
									<CardTitle className="flex items-center gap-3">
										<BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
										Manage Recipes
									</CardTitle>
									<CardDescription className="text-blue-600/80 dark:text-blue-400/80">
										Browse and manage your recipe collection
									</CardDescription>
								</CardHeader>
							</Card>
						</Link>
						<Link href="/categories" className="h-full">
							<Card className="hover:shadow-lg transition-all duration-300 h-full bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
								<CardHeader>
									<CardTitle className="flex items-center gap-3">
										<FolderKanban className="h-6 w-6 text-purple-600 dark:text-purple-400" />
										Categories
									</CardTitle>
									<CardDescription className="text-purple-600/80 dark:text-purple-400/80">
										Organize recipes by category
									</CardDescription>
								</CardHeader>
							</Card>
						</Link>
						<Link href="/submit" className="h-full">
							<Card className="hover:shadow-lg transition-all duration-300 h-full bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
								<CardHeader>
									<CardTitle className="flex items-center gap-3">
										<PlusCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
										Add Recipe
									</CardTitle>
									<CardDescription className="text-green-600/80 dark:text-green-400/80">
										Share your favorite recipes
									</CardDescription>
								</CardHeader>
							</Card>
						</Link>
						<Link href="/shopping-list" className="h-full">
							<Card className="hover:shadow-lg transition-all duration-300 h-full bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 border-amber-200 dark:border-amber-800">
								<CardHeader>
									<CardTitle className="flex items-center gap-3">
										<ListChecks className="h-6 w-6 text-amber-600 dark:text-amber-400" />
										Shopping List
									</CardTitle>
									<CardDescription className="text-amber-600/80 dark:text-amber-400/80">
										Manage your grocery shopping list
									</CardDescription>
								</CardHeader>
							</Card>
						</Link>
					</div>
				</section>

				<section className="space-y-4">
					<h2 className="text-xl sm:text-2xl font-semibold">
						Featured Recipes
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
						{featuredRecipes.map((recipe) => (
							<Link
								href={`/recipes/${recipe.id}`}
								key={recipe.id}
								className="h-full"
							>
								<Card className="hover:shadow-lg transition-shadow h-full flex flex-col">
									<CardHeader>
										<CardTitle>{recipe.title}</CardTitle>
										<CardDescription>
											{recipe.cuisine} • {recipe.duration} • {recipe.difficulty}
										</CardDescription>
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
						))}
					</div>
				</section>
			</main>
		</div>
	);
}
