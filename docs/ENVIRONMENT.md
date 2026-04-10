# Environment Setup Guide

This guide provides detailed instructions for setting up the development environment for the Klean Frontend application.

## 📋 Prerequisites

### System Requirements

- **Operating System**: Windows 10/11, macOS 10.15+, or Linux (Ubuntu 18.04+)
- **Node.js**: Version 18.0.0 or higher
- **Package Manager**: npm (comes with Node.js), yarn, or pnpm
- **Git**: Version 2.25.0 or higher
- **Code Editor**: VS Code (recommended) with extensions

### Hardware Requirements

- **RAM**: Minimum 4GB, recommended 8GB+
- **Storage**: 2GB free space for installation and dependencies
- **Internet**: Stable internet connection for package downloads

## 🛠️ Installation Steps

### Step 1: Install Node.js

#### Windows
1. Download the LTS version from [nodejs.org](https://nodejs.org/)
2. Run the installer and follow the setup wizard
3. Verify installation:
   ```bash
   node --version
   npm --version
   ```

#### macOS
Using Homebrew (recommended):
```bash
brew install node
```

Or download from [nodejs.org](https://nodejs.org/)

#### Linux (Ubuntu/Debian)
```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Step 2: Install Git

#### Windows
Download from [git-scm.com](https://git-scm.com/download/win)

#### macOS
```bash
brew install git
```

#### Linux
```bash
sudo apt-get install git
```

### Step 3: Install VS Code

1. Download from [code.visualstudio.com](https://code.visualstudio.com/)
2. Install recommended extensions:
   - ES7+ React/Redux/React-Native snippets
   - Prettier - Code formatter
   - ESLint
   - Auto Rename Tag
   - Bracket Pair Colorizer
   - Tailwind CSS IntelliSense

## 📁 Project Setup

### Clone the Repository

```bash
# Clone the repository
git clone https://github.com/your-username/klean-frontend.git

# Navigate to the project directory
cd klean-frontend

# Install dependencies
npm install
```

### Alternative Package Managers

#### Using Yarn
```bash
# Install yarn globally
npm install -g yarn

# Install dependencies
yarn install
```

#### Using pnpm
```bash
# Install pnpm globally
npm install -g pnpm

# Install dependencies
pnpm install
```

## ⚙️ Environment Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Copy the example file
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# API Configuration
VITE_API_BASE=https://klean-dev.onrender.com/api/v1

# Development Configuration
VITE_APP_ENV=development
VITE_APP_NAME=Klean Frontend

# Optional: Analytics and Monitoring
VITE_ANALYTICS_ID=your-analytics-id
VITE_SENTRY_DSN=your-sentry-dsn

# Optional: Feature Flags
VITE_ENABLE_DEBUG=true
VITE_ENABLE_ANALYTICS=false
```

### Environment Files

- `.env.local` - Local environment variables (not committed)
- `.env.development` - Development environment
- `.env.production` - Production environment
- `.env.example` - Example file for other developers

## 🚀 Running the Application

### Development Server

```bash
# Start the development server
npm run dev

# The application will be available at http://localhost:5173
```

### Build for Production

```bash
# Create a production build
npm run build

# Preview the production build
npm run preview
```

### Other Scripts

```bash
# Run linting
npm run lint

# Run linting with auto-fix
npm run lint:fix

# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🔧 Development Tools Setup

### ESLint Configuration

The project uses ESLint for code quality. Configuration is in `eslint.config.js`:

```javascript
import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
    },
    rules: {
      // Custom rules
    },
  },
];
```

### Prettier Configuration

Code formatting is handled by Prettier. Configuration in `package.json`:

```json
{
  "prettier": {
    "semi": true,
    "trailingComma": "es5",
    "singleQuote": true,
    "printWidth": 100,
    "tabWidth": 2
  }
}
```

### VS Code Settings

Create `.vscode/settings.json` in the project root:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  },
  "tailwindCSS.includeLanguages": {
    "javascript": "javascriptreact"
  },
  "files.associations": {
    "*.css": "tailwindcss"
  }
}
```

## 🗄️ Database Setup (if applicable)

If your application requires a local database:

### Using Docker

```bash
# Install Docker Desktop
# https://www.docker.com/products/docker-desktop

# Run database container
docker run --name klean-db -e POSTGRES_PASSWORD=password -d -p 5432:5432 postgres:13

# Or using docker-compose
docker-compose up -d
```

### Local Database Setup

For local development without Docker:

1. Install PostgreSQL locally
2. Create a database named `klean_dev`
3. Update your `.env.local` with database credentials

## 🔐 Authentication Setup

### JWT Tokens

The application uses JWT for authentication. Tokens are stored in `sessionStorage`.

### API Authentication

Ensure your backend API is running and accessible. Update `VITE_API_BASE` in your environment file.

## 🧪 Testing Setup

### Unit Testing

Tests are written using Vitest and React Testing Library:

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Configuration

Test setup is in `src/test/setup.js`:

```javascript
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend expect with jest-dom matchers
expect.extend(matchers);

// Clean up after each test
afterEach(() => {
  cleanup();
});
```

## 🚀 Deployment

### Vercel Deployment

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Follow the prompts to configure your project

### Manual Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Serve the `dist` folder using any static server:
   ```bash
   npx serve dist
   ```

## 🔍 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Kill process using port 5173
npx kill-port 5173

# Or use a different port
npm run dev -- --port 3000
```

#### Node Modules Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Build Errors
```bash
# Clear cache and rebuild
npm run clean
npm run build
```

#### ESLint Errors
```bash
# Auto-fix linting issues
npm run lint:fix
```

### Performance Issues

- Ensure you have enough RAM (8GB+ recommended)
- Close unnecessary applications
- Use `npm ci` instead of `npm install` for faster installs

### Network Issues

- Check your internet connection
- Clear npm cache: `npm cache clean --force`
- Try using a different registry: `npm config set registry https://registry.npmjs.org/`

## 📞 Getting Help

If you encounter issues:

1. Check the [README.md](../README.md) for common solutions
2. Search existing [GitHub issues](https://github.com/your-repo/issues)
3. Create a new issue with detailed information:
   - OS and Node.js version
   - Error messages
   - Steps to reproduce
   - Screenshots if applicable

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [React Query Documentation](https://tanstack.com/query/)
- [VS Code Documentation](https://code.visualstudio.com/docs)

## 🎯 Next Steps

After setting up the environment:

1. Familiarize yourself with the [project structure](../README.md#project-structure)
2. Read the [API documentation](./API.md)
3. Review the [component documentation](./COMPONENTS.md)
4. Start contributing by following the [contributing guidelines](./CONTRIBUTING.md)

Happy coding! 🚀</content>
<parameter name="filePath">c:\Users\DELL\klean-frontend\docs\ENVIRONMENT.md