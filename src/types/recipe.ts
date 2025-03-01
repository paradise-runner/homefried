export interface Recipe {
	id: string;
	title: string;
	description: string;
	cuisine: string;
	duration: string;
	difficulty: string;
	ingredients: string[];
	instructions: string[];
	image?: string;
}
