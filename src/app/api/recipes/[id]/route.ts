import { NextResponse, NextRequest } from "next/server";
import { recipes } from "@/data/recipes";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;

	const recipe = recipes.find((recipe) => recipe.id === id);

	if (!recipe) {
		return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
	}

	return NextResponse.json(recipe);
}
