const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const askQuestion = (query) => {
  return new Promise(resolve => rl.question(query, resolve));
};

const runCommand = (command) => {
  try {
    console.log(`Running: ${command}`);
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Command failed: ${command}`);
    console.error(`Error: ${error.message}`);
    console.error(`stderr: ${error.stderr ? error.stderr.toString() : 'No stderr'}`);
    console.error(`stdout: ${error.stdout ? error.stdout.toString() : 'No stdout'}`);
    process.exit(1);
  }
};

const setupProject = async () => {
  // Step 1: Ask for the project name
  const projectName = await askQuestion("Enter the name of your project: ");

  // Step 2: Ask about additional libraries
  const libraries = {
    'tailwindcss': 'Install Tailwind CSS? (y/n): ',
    'framer-motion': 'Install Framer Motion? (y/n): ',
    'gsap': 'Install GSAP? (y/n): ',
    '@tanstack/react-query': 'Install React Query? (y/n): ',
    'react-toastify': 'Install React Toastify? (y/n): ',
    'axios': 'Install Axios? (y/n): ',
    'date-fns': 'Install Date Fns? (y/n): ',
    'react-hook-form': 'Install React Hook Form? (y/n): '
  };

  const installChoices = [];
  for (const [pkg, prompt] of Object.entries(libraries)) {
    const answer = await askQuestion(prompt);
    if (answer.trim().toLowerCase() === 'y') {
      installChoices.push(pkg);
    }
  }

  // Step 3: Create a new Vite project
  runCommand(`npx create-vite@latest ${projectName} -- --template react`);

  // Step 4: Navigate to the project folder
  process.chdir(projectName);

  // Step 5: Install ESLint plugin for Vite
  runCommand("npm install vite-plugin-eslint --save-dev");

  // Step 6: Install additional libraries based on user input
  if (installChoices.length > 0) {
    let installCommand = "npm install";
    installChoices.forEach(pkg => {
      installCommand += ` ${pkg}@latest`;
    });
    runCommand(`${installCommand} --legacy-peer-deps`);
  }

  // Step 7: Create .eslintrc.cjs configuration file
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

  fs.writeFileSync('.eslintrc.cjs', eslintConfig);

  // Step 8: Update Vite config file
  const viteConfig = `
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), eslint()],
});
`;

  fs.writeFileSync('vite.config.js', viteConfig);

  // Step 9: Perform file and directory modifications

  // Define paths
  const srcPath = path.join(process.cwd(), 'src');
  const appCssPath = path.join(srcPath, 'app.css');
  const assetsPath = path.join(srcPath, 'assets');
  const appJsxPath = path.join(srcPath, 'App.jsx');
  const indexCssPath = path.join(srcPath, 'index.css');

  // Delete app.css file and assets folder
  if (fs.existsSync(appCssPath)) {
    fs.unlinkSync(appCssPath);
  }
  if (fs.existsSync(assetsPath)) {
    fs.rmdirSync(assetsPath, { recursive: true });
  }

  // Create required directories
  const directories = ['components', 'hooks', 'context', 'pages', 'utils', 'services', 'UI'];
  directories.forEach(dir => {
    const dirPath = path.join(srcPath, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }
  });

  // Clear and update App.jsx based on React Query installation
  const isReactQueryInstalled = installChoices.includes('@tanstack/react-query');
  const appJsxContent = isReactQueryInstalled
    ? `import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter, Routes } from 'react-router-dom';

const queryClient = new QueryClient();

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
};`
    : `import { BrowserRouter, Routes } from 'react-router-dom';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
      </Routes>
    </BrowserRouter>
  );
};`;

  fs.writeFileSync(appJsxPath, appJsxContent);

  // Clear and update index.css
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
  line-height: 1.5;
}
*,
*::before,
*::after {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}
input,
button,
textarea,
select {
  font: inherit;
  color: inherit;
}
button {
  cursor: pointer;
}
*:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
input:focus,
button:focus,
textarea:focus,
select:focus {
  outline-offset: -1px;
}
a {
  color: inherit;
  text-decoration: none;
}
ul {
  list-style: none;
}
p,
h1,
h2,
h3,
h4,
h5,
h6 {
  overflow-wrap: break-word;
  hyphens: auto;
}
img {
  pointer-events: none;
}
img:after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
}
`;

  fs.writeFileSync(indexCssPath, indexCssContent);

  // Step 10: Open the project in VS Code
  runCommand("code .");

  // Step 11: Final message
  console.log(`Setup is complete! Navigate to your project folder with 'cd ${projectName}' and start developing with 'npm run dev'.`);

  rl.close();
};

setupProject();
