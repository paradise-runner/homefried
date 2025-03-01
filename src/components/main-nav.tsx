"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { ModeToggle } from "./mode-toggle";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import {
	Menu,
	BookOpen,
	FolderKanban,
	PlusCircle,
	Calendar,
	ListChecks,
} from "lucide-react";

export function MainNav() {
	return (
		<header className="border-b px-4">
			<div className="container mx-auto flex items-center justify-between h-16">
				<Link href="/" className="font-bold text-xl flex items-center gap-2">
					<img src="/favicon.ico" alt="HomeFried Logo" width={56} height={56} />
					HomeFried
				</Link>

				{/* Desktop Navigation */}
				<nav className="hidden md:flex items-center gap-6">
					<Link href="/recipes" className="flex items-center gap-2">
						<BookOpen className="h-4 w-4" />
						<span>Manage Recipes</span>
					</Link>
					<Link href="/categories" className="flex items-center gap-2">
						<FolderKanban className="h-4 w-4" />
						<span>Categories</span>
					</Link>
					<Link href="/meal-planner" className="flex items-center gap-2">
						<Calendar className="h-4 w-4" />
						<span>Meal Planner</span>
					</Link>
					<Link href="/shopping-list" className="flex items-center gap-2">
						<ListChecks className="h-4 w-4" />
						<span>Shopping List</span>
					</Link>
					<ModeToggle />
					<Button asChild>
						<Link href="/submit" className="flex items-center gap-2">
							<PlusCircle className="h-4 w-4" />
							<span>Add Recipe</span>
						</Link>
					</Button>
				</nav>

				{/* Mobile Navigation */}
				<div className="flex md:hidden items-center gap-2">
					<ModeToggle />
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="icon">
								<Menu className="h-6 w-6" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-48">
							<DropdownMenuItem asChild>
								<Link href="/recipes" className="flex items-center gap-2">
									<BookOpen className="h-4 w-4" />
									<span>Manage Recipes</span>
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<Link href="/categories" className="flex items-center gap-2">
									<FolderKanban className="h-4 w-4" />
									<span>Categories</span>
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<Link href="/meal-planner" className="flex items-center gap-2">
									<Calendar className="h-4 w-4" />
									<span>Meal Planner</span>
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<Link href="/shopping-list" className="flex items-center gap-2">
									<ListChecks className="h-4 w-4" />
									<span>Shopping List</span>
								</Link>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem asChild>
								<Link href="/submit" className="flex items-center gap-2">
									<PlusCircle className="h-4 w-4" />
									<span>Add Recipe</span>
								</Link>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</header>
	);
}
