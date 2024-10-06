
# OrbitScout

OrbitScout is an interactive 3D web app designed to track and visualize Near-Earth Objects (NEOs) in real time. By leveraging cutting-edge visualization tools like Three.js and real-time NASA data, users can explore asteroid orbits and other space objects as they approach Earth, providing a unique view of celestial events and potential hazards.

## Table of Contents
1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Project Structure](#project-structure)
4. [Key Components](#key-components)
5. [Utilities](#utilities)
6. [Styling](#styling)
7. [API Services](#api-services)
8. [Scripts](#scripts)
9. [Configuration](#configuration)
10. [Contributor's Guide](#contributors-guide)
11. [License](#license)
12. [Learn More](#learn-more)
13. [Deployment](#deployment)

## Introduction

OrbitScout provides a user-friendly, interactive platform to visualize the orbits of asteroids and other NEOs as they approach Earth. The app enables real-time exploration of these objects with 3D graphics powered by Three.js and NASA's data API, making it a powerful tool for both educational and research purposes. 

OrbitScout is deployed at: [https://orbit-scout.vercel.app/](https://orbit-scout.vercel.app/).

## Getting Started

To run the project locally, you can use the following commands:

```bash
npm run dev     # using npm
yarn dev        # using yarn
pnpm dev        # using pnpm
bun dev         # using bun
```

Once the development server is running, open [http://localhost:3000](http://localhost:3000) in your browser to view the app. You can begin editing the project by modifying the `src/app/page.tsx` file. The app automatically updates as you save your changes.

## Project Structure

The following is a high-level view of the project structure:

```plaintext
orbit-scout/
├── .next/             # Build artifacts (auto-generated)
├── src/               # Main source code
│   ├── app/           # Pages and layouts
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/    # Reusable UI components
│   │   ├── ui/
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── button.tsx
│   │   │   ├── calendar.tsx
│   │   │   └── alert.tsx
│   ├── lib/           # Utility functions and helpers
│   │   └── utils.ts
│   ├── services/      # API service integrations
│   │   └── nasaApi.ts
├── package.json       # Project dependencies and scripts
├── tsconfig.json      # TypeScript configuration
└── README.md          # Project documentation
```

## Key Components

- **Dialog** (`dialog.tsx`): Provides a modal dialog component for user interactions.
- **Button** (`button.tsx`): A customizable button component with different styles and variants.
- **Calendar** (`calendar.tsx`): A component that allows users to select dates.
- **Card** (`card.tsx`): A flexible card component that can hold content such as headers and footers.

## Utilities

- **Class Name Utility** (`utils.ts`): The `cn` function merges and manages multiple CSS class names effectively.

## Styling

- **Global Styles** (`globals.css`): Contains the main styling for the app, including Tailwind CSS configurations.

## API Services

- **NASA API** (`nasaApi.ts`): This file contains functions to fetch Near-Earth Object data from NASA's public APIs. It includes methods to retrieve asteroid information, orbits, and other relevant data.

## Scripts

- **Development:** `npm run dev` - Starts the development server.
- **Build:** `npm run build` - Creates a production build of the project.
- **Start:** `npm run start` - Runs the production server.
- **Lint:** `npm run lint` - Runs ESLint to check for code quality issues.

## Configuration

- **TypeScript:** (`tsconfig.json`): This file configures TypeScript settings for the project.
- **Tailwind CSS:** (`tailwind.config.ts`): Configuration file for Tailwind CSS.
- **ESLint:** (`.eslintrc.json`): This file configures ESLint rules to ensure code quality.
- **Environment Variables:** (`.env`): Stores environment-specific variables, such as API keys.

## Contributor's Guide

We welcome contributions from developers of all levels! If you're interested in contributing to OrbitScout, here are some ways to get started:

### How to Contribute

1. **Report Bugs:** If you find any issues, feel free to [open an issue](https://github.com/your-repository/issues) in the GitHub repository.
2. **Suggest Features:** Have an idea to improve the app? Open a discussion or suggest features via GitHub.
3. **Submit Pull Requests:** Fork the repository and submit a pull request with your contributions. Please make sure your changes are well-tested.

### Development Workflow

1. **Fork the Repository:** Click "Fork" at the top of the repository page.
2. **Clone the Forked Repository:**
    ```bash
    git clone https://github.com/your-username/OrbitScout.git
    ```
3. **Install Dependencies:**
    ```bash
    npm install
    ```
4. **Create a New Branch:**
    ```bash
    git checkout -b feature-branch
    ```
5. **Make Changes:** Update code and add relevant tests.
6. **Commit Your Changes:**
    ```bash
    git commit -m "Description of changes"
    ```
7. **Push Your Changes:**
    ```bash
    git push origin feature-branch
    ```
8. **Open a Pull Request:** Open a pull request on GitHub to merge your changes.

### Code Style

Please adhere to the existing code style guidelines. Run the following to check for style issues:
```bash
npm run lint
```

### Running Tests

Make sure to add and run tests for any new features or changes:
```bash
npm test
```

## License

By contributing to OrbitScout, you agree to license your contributions under the MIT License.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs) - Learn more about Next.js and its API.
- [Learn Next.js](https://nextjs.org/learn) - Interactive tutorials for mastering Next.js.
- [Next.js GitHub Repository](https://github.com/vercel/next.js) - Browse the code and contribute to Next.js.

## Deployment

The recommended platform for deploying your Next.js app is [Vercel](https://vercel.com), the creators of Next.js. You can easily deploy with zero-configuration by following their [deployment documentation](https://nextjs.org/docs/deployment). OrbitScout is deployed at: [https://orbit-scout.vercel.app/](https://orbit-scout.vercel.app/).
