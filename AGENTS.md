# AGENTS.md: A Guide for AI Agents

This document provides a comprehensive guide for AI agents working within the `shumanbeans` codebase. It covers the project's architecture, development practices, and deployment process to ensure effective and autonomous operation.

## 1. Project Overview

The project is a wedding website for "the Shumanbeans," designed to share their love story and celebration details with guests. It is built as a modern, responsive web application with a SvelteKit frontend and a Node.js backend. The site features interactive elements, real-time communication, and a clean, elegant design.

## 2. Technology Stack

The core technologies used in this project are:

- **Frontend**:
  - **SvelteKit**: A modern web framework for building high-performance Svelte applications.
  - **TypeScript**: For type-safe JavaScript development.
  - **TailwindCSS**: A utility-first CSS framework for rapid UI development.

- **Backend**:
  - **Node.js**: A JavaScript runtime for server-side development.
  - **Express**: A minimalist web framework for Node.js, used to build the backend API.
  - **Socket.IO**: For enabling real-time, bidirectional communication between the client and server.

- **Database**:
  - **better-sqlite3**: A library for high-performance SQLite database operations.

- **Development & Tooling**:
  - **Vite**: A fast build tool and development server.
  - **ESLint**: For identifying and fixing problems in JavaScript code.
  - **Prettier**: An opinionated code formatter to ensure consistent style.
  - **PM2**: A process manager for Node.js applications in production.

## 3. Project Structure

The repository is organized as follows:

```
shumanbeans/
├── src/
│   ├── routes/             # SvelteKit routes, defining the app's pages
│   │   ├── +layout.svelte  # Global layout component
│   │   └── +page.svelte    # The main landing page
│   ├── lib/
│   │   └── components/     # Reusable Svelte components
│   └── app.html            # The main HTML shell for the application
├── server.js               # The Node.js Express backend server
├── deploy.sh               # Script for deploying the application to production
├── package.json            # Project metadata, dependencies, and scripts
├── svelte.config.js        # SvelteKit configuration
└── tailwind.config.js      # TailwindCSS theme and customization
```

## 4. Getting Started

To set up the development environment, follow these steps:

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run the Development Server**:
    ```bash
    npm run dev
    ```
    This command starts the SvelteKit development server, which is accessible at `http://localhost:5173`. The backend server runs concurrently.

## 5. Development Scripts

The `package.json` file includes several scripts for common development tasks:

- `npm run build`: Compiles the SvelteKit application for production.
- `npm run dev`: Starts the development server with hot-reloading.
- `npm run preview`: Serves the production build locally for testing.
- `npm run lint`: Lints the codebase using ESLint.
- `npm run format`: Formats all files with Prettier.

## 6. Backend API

The backend is an Express server defined in `server.js`. It exposes the following endpoints:

- **`POST /api/intent`**: A general-purpose endpoint for processing user intents. It accepts a JSON payload with an `intent` string and returns a simulated result.
- **`GET /api/health`**: A health check endpoint that returns the server's status.

## 7. Real-time Features

The application uses **Socket.IO** for real-time communication. The server-side Socket.IO logic is initialized in `server.js`, allowing for features like live updates and interactive guest experiences.

## 8. Deployment

The `deploy.sh` script automates the deployment process to a Digital Ocean droplet. The key steps are:

1.  **System Setup**: Installs Node.js, Nginx, and other dependencies.
2.  **Cloning**: Clones the repository from GitHub.
3.  **Building**: Installs npm dependencies and builds the SvelteKit application (`npm run build`).
4.  **Process Management**: Uses **PM2** to run the `server.js` application persistently.
5.  **Reverse Proxy**: Configures **Nginx** as a reverse proxy to forward traffic from port 80 to the Node.js application running on port 3000.

To deploy, run the script on the target server:
```bash
./deploy.sh
```

## 9. Database

The project uses **SQLite** as its database, with the `better-sqlite3` package providing a high-performance interface. The database file (`hackbox.db`) is located in the root directory.

## 10. Code Style

Code consistency is maintained through **Prettier** and **ESLint**.

- **Prettier**: Automatically formats code to a consistent style. Use `npm run format` to apply formatting.
- **ESLint**: Statically analyzes the code to find and fix problems. Use `npm run lint` to check for issues.

By adhering to these guidelines, AI agents can effectively navigate, contribute to, and maintain the `shumanbeans` codebase.


