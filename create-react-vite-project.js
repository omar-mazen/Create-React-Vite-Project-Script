const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const readline = require("readline");

// ANSI escape codes for colors
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  underscore: "\x1b[4m",
  blink: "\x1b[5m",
  reverse: "\x1b[7m",
  hidden: "\x1b[8m",

  fg: {
    black: "\x1b[30m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",
    gray: "\x1b[90m",
  },
  bg: {
    black: "\x1b[40m",
    red: "\x1b[41m",
    green: "\x1b[42m",
    yellow: "\x1b[43m",
    blue: "\x1b[44m",
    magenta: "\x1b[45m",
    cyan: "\x1b[46m",
    white: "\x1b[47m",
  },
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const askQuestion = (query) => {
  return new Promise((resolve) => rl.question(query, resolve));
};

const runCommand = (command) => {
  console.log(colors.fg.blue + `\nRunning: ${command}...` + colors.reset);
  try {
    execSync(command, { stdio: "inherit" });
    console.log(colors.fg.green + `✔ Completed: ${command}\n` + colors.reset);
  } catch (error) {
    console.error(
      colors.fg.red + `✖ Command failed: ${command}` + colors.reset
    );
    console.error(colors.fg.red + `Error: ${error.message}` + colors.reset);
    process.exit(1);
  }
};

const setupProject = async () => {
  // Step 1: Show welcome message
  console.log(
    colors.fg.cyan + colors.bright + "\n==============================="
  );
  console.log("  Welcome to React Setup CLI  ");
  console.log("===============================\n" + colors.reset);

  // Step 2: Ask for the project name
  const projectName = await askQuestion(
    colors.fg.yellow + "Enter the name of your project: " + colors.reset
  );

  // Step 3: Ask about additional libraries
  const libraries = {
    "react-router-dom": "Install React Router? (y/n): ",
    "@tanstack/react-query": "Install React Query? (y/n): ",
    tailwindcss: "Install Tailwind CSS? (y/n): ",
    "framer-motion": "Install Framer Motion? (y/n): ",
    gsap: "Install GSAP? (y/n): ",
    "react-toastify": "Install React Toastify? (y/n): ",
    axios: "Install Axios? (y/n): ",
    "date-fns": "Install Date Fns? (y/n): ",
    "react-hook-form": "Install React Hook Form? (y/n): ",
  };

  const installChoices = [];
  for (const [pkg, prompt] of Object.entries(libraries)) {
    const answer = await askQuestion(colors.fg.cyan + prompt + colors.reset);
    if (answer.trim().toLowerCase() === "y") {
      installChoices.push(pkg);
    }
  }

  // Step 4: Create a new Vite project
  runCommand(`npx create-vite@latest ${projectName} -- --template react`);

  // Step 5: Navigate to the project folder
  process.chdir(projectName);

  // Step 6: Install ESLint plugin for Vite
  runCommand("npm install vite-plugin-eslint --save-dev");

  // Step 7: Install additional libraries based on user input
  if (installChoices.length > 0) {
    let installCommand = "npm install";
    installChoices.forEach((pkg) => {
      installCommand += ` ${pkg}@latest`;
    });
    runCommand(`${installCommand} --legacy-peer-deps`);
  }

  // Step 8: Create .eslintrc.cjs configuration file
  const eslintConfig = `
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@babel/eslint-parser",
  parserOptions: { 
    ecmaVersion: "latest", 
    sourceType: "module",
    requireConfigFile: false 
  },
  settings: { 
    react: { version: "18.2" } 
  },
  plugins: ["react-refresh"],
  rules: {
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    "no-unused-vars": "warn",
    "react/prop-types": 0,
  },
};`;

  fs.writeFileSync(".eslintrc.cjs", eslintConfig);

  // Step 9: Update Vite config file
  const viteConfig = `
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), eslint()],
});
`;

  fs.writeFileSync("vite.config.js", viteConfig);

  // Step 10: Perform file and directory modifications

  const srcPath = path.join(process.cwd(), "src");
  const appCssPath = path.join(srcPath, "app.css");
  const assetsPath = path.join(srcPath, "assets");
  const appJsxPath = path.join(srcPath, "App.jsx");
  const indexCssPath = path.join(srcPath, "index.css");

  if (fs.existsSync(appCssPath)) {
    fs.unlinkSync(appCssPath);
  }
  if (fs.existsSync(assetsPath)) {
    fs.rmdirSync(assetsPath, { recursive: true });
  }

  const directories = [
    "components",
    "hooks",
    "context",
    "pages",
    "utils",
    "services",
    "UI",
  ];
  directories.forEach((dir) => {
    const dirPath = path.join(srcPath, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }
  });

  const isReactRouterInstalled = installChoices.includes("react-router-dom");
  const isReactQueryInstalled = installChoices.includes(
    "@tanstack/react-query"
  );

  let appJsxContent = "";

  if (isReactQueryInstalled && !isReactRouterInstalled) {
    appJsxContent = `import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};`;
  } else if (isReactQueryInstalled && isReactRouterInstalled) {
    appJsxContent = `import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter, Routes } from 'react-router-dom';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <BrowserRouter>
        <Routes>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};`;
  } else if (!isReactQueryInstalled && isReactRouterInstalled) {
    appJsxContent = `import { BrowserRouter, Routes } from 'react-router-dom';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
      </Routes>
    </BrowserRouter>
  );
};`;
  }

  fs.writeFileSync(appJsxPath, appJsxContent);

  const indexCssContent = `
:root {
}
html {
  -moz-text-size-adjust: none;
  -webkit-text-size-adjust: none;
  text-size-adjust: none;
}
body {
  min-height: 100vh;
  line-height: 1;
  margin: 0;
  padding: 0;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}
`;

  fs.writeFileSync(indexCssPath, indexCssContent);

  // Step 11: Final message
  console.log(
    colors.fg.green +
      colors.bright +
      "\nAll set! Your React project has been configured.\n" +
      colors.reset
  );
  // Step 12: open project on vs code
  runCommand("code .");
  rl.close();
};

setupProject();
