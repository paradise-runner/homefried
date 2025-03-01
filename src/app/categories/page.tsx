import Link from "next/link";
import { getCategories } from "@/lib/recipes";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export default function CategoriesPage() {
	const categories = getCategories();
	return (
		<div className="container mx-auto py-6 px-4 sm:py-8 sm:px-6">
			<h1 className="text-xl sm:text-2xl font-bold mb-4">Categories</h1>
			<div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
				{categories.map((category) => (
					<Link href={`/categories/${category}`} key={category}>
						<Card className="cursor-pointer hover:shadow-lg">
							<CardHeader>
								<CardTitle>{category}</CardTitle>
							</CardHeader>
						</Card>
					</Link>
				))}
			</div>
		</div>
	);
}
