# HomeFried 

![HomeFried](./src/app/favicon.ico)

A self-hosted recipe management website built with modern web technologies. HomeFried allows you to manage your recipes, plan meals, and create shopping lists all in one place, with everything running locally on your machine.

## Features

- 📝 Recipe management and organization
- 🏷️ Recipe categorization
- 📅 Meal planning functionality
- 🛒 Shopping list generation
- 🌗 Light/dark mode support
- 💻 Completely local and self-hosted

## ⚠️ Disclaimer ⚠️

HomeFried is a personal project and is not intended for production use. The application is still in development and may contain bugs or incomplete features. Use at your own risk.

Recipe datais are stored and manipulated via editing the recipes.ts file in the `data` folder. This is _NOT_ a secure or scalable solution for storing data, and is only intended for local development purposes. This is accomplished via the api directly manipulating the recipes.ts file and bun hot reloading the changes.


## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with React 19
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **UI Components**: 
  - [Radix UI](https://www.radix-ui.com/) for accessible components
  - Custom UI components built with TailwindCSS
- **Development Tools**:
  - [Biome](https://biomejs.dev/) for linting and formatting
  - [Turbopack](https://turbo.build/pack) for fast development builds

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [Bun](https://bun.sh/) for package management
- [Ollama](https://ollama.ai/) for AI-powered recipe processing

## Setup

1. Install Ollama:
   - Visit [Ollama's website](https://ollama.ai/) and follow the installation instructions for your operating system
   - After installation, run the following command to pull the required model:
     ```bash
     ollama pull llama3.2
     ```

2. Configure Environment Variables:
   - Create a `.env.local` file in the project root
   - Add your local machine's IP address:
     ```bash
     OLLAMA_HOST=http://<your-ip-address>:11434
     ```
   - To find your IP address:
     - On macOS/Linux: Run `ifconfig` or `ip addr show`
     - On Windows: Run `ipconfig`
   - Use the IPv4 address of your primary network interface

3. Clone the repository:
   ```bash
   git clone <repository-url>
   cd homefried
   ```

4. Install dependencies:
   ```bash
   bun install
   ```

5. Add a recipes.ts file to the data folder with the following format:
    ```typescript
    import type { Recipe } from "@/types/recipe";

    export const recipes: Recipe[] = [
      {
        title: "test",
        description: "test",
        cuisine: "test",
        duration: "30 mins",
        difficulty: "Medium",
        ingredients: [
          "400g spaghetti",
          "200g pancetta",
          "4 large eggs",
          "100g Pecorino Romano",
          "Black pepper",
        ],
        instructions: [
          "Cook pasta in salted water",
          "Fry pancetta until crispy",
          "Mix eggs and cheese",
          "Combine all ingredients",
          "Serve with extra cheese and pepper",
        ],
        id: "1",
      },
    ];

    ```

5. Start the development server:
   ```bash
   bun dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Available Scripts

- `bun run dev` - Start the development server with Turbopack
- `bun run lint` - Lint the codebase using Biome
- `bun run format` - Format the codebase using Biome

## Project Structure

```
src/
├── app/              # Next.js app router pages and API routes
├── components/       # Reusable React components
├── data/            # Data layer and storage
├── lib/             # Utility functions and shared logic
├── types/           # TypeScript type definitions
└── utils/           # Helper utilities
```

## Contributing

Feel free to open issues and pull requests for any improvements you'd like to contribute.

## License

[Add your chosen license here]