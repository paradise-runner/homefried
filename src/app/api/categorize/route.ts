import { NextResponse } from 'next/server';

const OLLAMA_IP = process.env.OLLAMA_IP || "localhost";

async function categorizeIngredient(ingredient: string): Promise<string> {
  try {
    const response = await fetch(`http://${OLLAMA_IP}:11434/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        // llama3.2 is the most accurate small model at the time of writing
        // llama3.2:1b is faster but less accurate
        model: 'llama3.2',
        prompt: `Categorize this ingredient into one of these categories: Produce, Sauces & Condiments, Breads & Cereals, Oils & Dressings, Meat, Pasta & Rice & Beans, Canned Foods & Soups, Baking Items, Dairy & Eggs & Cheese, Beverages, Snacks & Candy, Household Items, Frozen Foods, Bakery, Spices & Seasonings, Deli, Wine & Beer & Spirits, Coffee & Tea, Seafood. Only respond with the category name.\nIngredient: ${ingredient}`,
        stream: false
      })
    });

    const data = await response.json();
    return data.response.trim();
  } catch (error) {
    console.error('Error categorizing ingredient:', error);
    return 'Other';
  }
}

export async function POST(request: Request) {
  const { ingredients } = await request.json();

  const categorized = await Promise.all(
    ingredients.map(async (ingredient: string) => ({
      ingredient,
      category: await categorizeIngredient(ingredient)
    }))
  );

  return NextResponse.json({ categorized });
}
