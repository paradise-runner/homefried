"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { getAllRecipes, getCategories } from "@/lib/recipes";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { Recipe } from "@/types/recipe";

export default function MealPlanner() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const categories = getCategories();
    const [excludedCategories, setExcludedCategories] = useState<string[]>(["Dessert"]);
    const [weeklyPlan, setWeeklyPlan] = useState<Recipe[]>([]);

    useEffect(() => {
        const planParam = searchParams.get('plan');
        if (planParam) {
            const recipeIds = planParam.split(',');
            const allRecipes = getAllRecipes();
            const planFromUrl = recipeIds
                .map(id => allRecipes.find(recipe => recipe.id === id))
                .filter((recipe): recipe is Recipe => recipe !== undefined);
            setWeeklyPlan(planFromUrl);
        }

        const excludedParam = searchParams.get('excluded');
        if (excludedParam) {
            setExcludedCategories(excludedParam.split(','));
        }
    }, [searchParams]);

    const generatePlan = () => {
        const allRecipes = getAllRecipes();
        const filteredRecipes = allRecipes.filter(
            (recipe) => !excludedCategories.includes(recipe.cuisine),
        );

        const shuffled = [...filteredRecipes].sort(() => Math.random() - 0.5);
        const newPlan = shuffled.slice(0, 7);
        setWeeklyPlan(newPlan);

        // Update URL with new plan
        const params = new URLSearchParams();
        params.set('plan', newPlan.map(recipe => recipe.id).join(','));
        params.set('excluded', excludedCategories.join(','));
        router.push(`/meal-planner?${params.toString()}`);
    };

    return (
        <div className="container mx-auto px-4 py-6 md:py-10 space-y-6 md:space-y-8">
            <h1 className="text-2xl md:text-3xl font-bold">Weekly Meal Planner</h1>

            <div className="space-y-3 md:space-y-4">
                <h2 className="text-lg md:text-xl font-semibold">Exclude Categories</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap gap-3 md:gap-4">
                    {categories.map((category) => (
                        <div key={category} className="flex items-center space-x-2">
                            <Checkbox
                                id={category}
                                checked={excludedCategories.includes(category)}
                                onCheckedChange={(checked) => {
                                    if (checked) {
                                        setExcludedCategories([...excludedCategories, category]);
                                    } else {
                                        setExcludedCategories(
                                            excludedCategories.filter((c) => c !== category),
                                        );
                                    }
                                }}
                            />
                            <label htmlFor={category} className="text-sm md:text-base">{category}</label>
                        </div>
                    ))}
                </div>

                <Button onClick={generatePlan} className="w-full md:w-auto">Generate Weekly Plan</Button>
            </div>

            {weeklyPlan.length > 0 && (
                <div className="space-y-3 md:space-y-4">
                    <h2 className="text-lg md:text-xl font-semibold">Your Weekly Plan</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                        {weeklyPlan.map((recipe, index) => (
                            <Link href={`/recipes/${recipe.id}`} key={recipe.id}>
                                <Card className="hover:shadow-lg transition-shadow h-full">
                                    <CardHeader className="pb-2 md:pb-4">
                                        <CardTitle className="text-base md:text-lg">{`Day ${index + 1}: ${recipe.title}`}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="aspect-video bg-muted rounded-md relative overflow-hidden">
                                            <img
                                                src={`/recipe-images/${recipe.id}.jpg`}
                                                alt={recipe.title}
                                                className="object-cover w-full h-full"
                                                loading="lazy"
                                            />
                                        </div>
                                        <p className="mt-2 text-xs md:text-sm text-muted-foreground">
                                            {recipe.cuisine} • {recipe.duration} • {recipe.difficulty}
                                        </p>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
