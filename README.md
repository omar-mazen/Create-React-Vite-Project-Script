# Create React Vite Project Script

This script automates the setup of a new React project using Vite, along with optional installations of various libraries. It also configures ESLint and Vite for your project.

## Features

- Creates a new Vite project with React template
- Installs optional libraries based on user input
- Configures ESLint and Vite with the appropriate plugins and settings
- Sets up project structure and initial files
- Opens the project in Visual Studio Code

## Prerequisites

Ensure you have the following installed:
- Node.js (latest LTS version)
- npm (Node Package Manager)
- Visual Studio Code (optional, for opening the project)

## Usage

1. **Clone this repository:**

   ```bash
   git clone https://github.com/your-username/your-repository.git
   cd your-repository
   ```

2. **Make the script executable (on Unix-based systems):**

   ```bash
   chmod +x create-react-vite-project.js
   ```

3. **Run the script:**

   ```bash
   node create-react-vite-project.js
   ```

4. **Follow the prompts to set up your project.**

## Script Overview

### 1. Asking for Project Details

The script will first prompt you for:
- The name of your project
- Whether to install additional libraries (Tailwind CSS, Framer Motion, GSAP, etc.)

### 2. Setting Up the Project

Based on your responses:
- A new Vite project will be created with the React template.
- Libraries you chose will be installed.
- ESLint and Vite configuration files will be set up.

### 3. Project Configuration

- **ESLint Configuration:** `.eslintrc.cjs`
- **Vite Configuration:** `vite.config.js`
- **File and Directory Structure:** Creates necessary directories and updates key files (e.g., `App.jsx`, `index.css`).

### 4. Final Steps

- Opens the newly created project in Visual Studio Code (optional).

## Example

Here is how the script will execute:

```plaintext
Enter the name of your project: my-react-app
Install Tailwind CSS? (y/n): y
Install Framer Motion? (y/n): n
Install GSAP? (y/n): y
Install React Query? (y/n): y
...
```

## Troubleshooting

- **Dependency Conflicts:** If you encounter dependency conflicts, you may need to use the `--legacy-peer-deps` option with npm commands.

- **File Permissions:** Ensure the script has execute permissions (on Unix-based systems) using `chmod +x create-react-vite-project.js`.

## Contributing

Feel free to submit issues or pull requests to improve the script.

