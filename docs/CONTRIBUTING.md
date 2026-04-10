# Contributing Guidelines

Welcome to the Klean Frontend project! We appreciate your interest in contributing. This document outlines the guidelines and best practices for contributing to this project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Commit Guidelines](#commit-guidelines)
- [Documentation](#documentation)

## 🤝 Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors. Please:

- Be respectful and inclusive in all interactions
- Focus on constructive feedback
- Help create a positive community
- Report any unacceptable behavior to the maintainers

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn** or **pnpm**
- **Git**
- **VS Code** (recommended) with ESLint extension

### Setup

1. **Fork the repository**
   ```bash
   git clone https://github.com/your-username/klean-frontend.git
   cd klean-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Run tests**
   ```bash
   npm run test
   ```

## 🔄 Development Workflow

### Branch Naming Convention

Use descriptive branch names following this pattern:

```
feature/description-of-feature
fix/description-of-fix
docs/description-of-docs
refactor/description-of-refactor
test/description-of-test
```

Examples:
- `feature/add-user-authentication`
- `fix/login-validation-bug`
- `docs/update-api-documentation`

### Development Process

1. **Create a branch from main**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, readable code
   - Follow the established patterns
   - Add tests for new functionality
   - Update documentation as needed

3. **Test your changes**
   ```bash
   npm run test
   npm run lint
   npm run build
   ```

4. **Commit your changes** (see commit guidelines below)

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**

## 📏 Code Standards

### JavaScript/React Guidelines

- Use **ES6+** features
- Prefer **functional components** with hooks
- Use **TypeScript** for type safety (where applicable)
- Follow **React best practices**

### Naming Conventions

```javascript
// Components: PascalCase
const UserProfile = () => { ... }

// Functions: camelCase
const getUserData = () => { ... }

// Constants: UPPER_SNAKE_CASE
const API_BASE_URL = 'https://api.example.com';

// Files: kebab-case for components, camelCase for utilities
// UserProfile.jsx, userUtils.js
```

### Code Style

- Use **Prettier** for code formatting
- Follow **ESLint** rules
- Maximum line length: **100 characters**
- Use **meaningful variable names**

### Component Structure

```jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const ComponentName = ({ prop1, prop2, onAction }) => {
  const [state, setState] = useState(initialValue);

  useEffect(() => {
    // Effect logic
  }, [dependencies]);

  const handleAction = () => {
    // Handler logic
    onAction(data);
  };

  return (
    <div className="component-container">
      {/* JSX content */}
    </div>
  );
};

ComponentName.propTypes = {
  prop1: PropTypes.string.isRequired,
  prop2: PropTypes.number,
  onAction: PropTypes.func.isRequired,
};

ComponentName.defaultProps = {
  prop2: 0,
};

export default ComponentName;
```

### State Management

- Use **local state** for component-specific data
- Use **React Query** for server state
- Use **Context API** sparingly for global app state
- Avoid prop drilling with proper component composition

### API Integration

```javascript
// Use React Query for data fetching
import { useQuery, useMutation } from '@tanstack/react-query';

const useUserData = (userId) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUserData(userId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
```

## 🧪 Testing

### Testing Strategy

- **Unit tests** for utilities and hooks
- **Component tests** for UI components
- **Integration tests** for user flows
- **E2E tests** for critical user journeys

### Testing Tools

- **Vitest** for unit and integration tests
- **React Testing Library** for component testing
- **Playwright** for E2E testing (future)

### Writing Tests

```javascript
// Component test example
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import UserProfile from './UserProfile';

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

describe('UserProfile', () => {
  it('displays user information', async () => {
    const queryClient = createTestQueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <UserProfile userId="123" />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  it('handles edit mode', () => {
    render(<UserProfile userId="123" />);

    const editButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);

    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
  });
});
```

### Test Coverage

- Aim for **80%+ code coverage**
- Focus on critical business logic
- Test error states and edge cases

## 🔄 Pull Request Process

### Before Submitting

1. **Update your branch**
   ```bash
   git checkout main
   git pull origin main
   git checkout your-branch
   git rebase main
   ```

2. **Run all checks**
   ```bash
   npm run lint
   npm run test
   npm run build
   ```

3. **Update documentation** if needed

### PR Template

Use this template when creating a pull request:

```markdown
## Description
Brief description of the changes made.

## Type of Change
- [ ] Bug fix (non-breaking change)
- [ ] New feature (non-breaking change)
- [ ] Breaking change
- [ ] Documentation update
- [ ] Refactoring

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed
- [ ] All tests pass

## Screenshots (if applicable)
Add screenshots of UI changes.

## Checklist
- [ ] Code follows project standards
- [ ] Tests added for new functionality
- [ ] Documentation updated
- [ ] No linting errors
- [ ] Build passes
```

### Review Process

1. **Automated checks** must pass
2. **Code review** by at least one maintainer
3. **Testing** verification
4. **Approval** and merge

## 📝 Commit Guidelines

### Commit Message Format

```
type(scope): description

[optional body]

[optional footer]
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples

```
feat(auth): add user login functionality

- Implement login form with validation
- Add JWT token storage
- Handle authentication errors

Closes #123
```

```
fix(api): handle network timeout errors

- Add retry logic for failed requests
- Improve error messages
- Update timeout configuration

Fixes #456
```

```
docs(readme): update installation instructions

- Add Node.js version requirements
- Include environment setup steps
- Add troubleshooting section
```

## 📚 Documentation

### Code Documentation

- Use **JSDoc** comments for functions and components
- Document **props** and **return values**
- Provide **usage examples**

```javascript
/**
 * Fetches user data from the API
 * @param {string} userId - The user's unique identifier
 * @returns {Promise<User>} User data object
 * @throws {ApiError} When the API request fails
 *
 * @example
 * const user = await getUserData('123');
 * console.log(user.name);
 */
const getUserData = async (userId) => {
  // Implementation
};
```

### Component Documentation

```jsx
/**
 * UserProfile component displays user information and allows editing
 *
 * @param {Object} props
 * @param {string} props.userId - User ID to fetch data for
 * @param {boolean} props.editable - Whether the profile can be edited
 * @returns {JSX.Element}
 *
 * @example
 * <UserProfile userId="123" editable={true} />
 */
const UserProfile = ({ userId, editable }) => {
  // Component implementation
};
```

### README Updates

- Keep the main README up to date
- Document new features and breaking changes
- Update installation and setup instructions

## 🐛 Issue Reporting

When reporting bugs, please include:

- **Clear title** describing the issue
- **Steps to reproduce**
- **Expected behavior**
- **Actual behavior**
- **Environment details** (OS, browser, Node version)
- **Screenshots** if applicable
- **Code snippets** or error messages

## 🙏 Recognition

Contributors will be recognized in:

- GitHub contributors list
- Changelog for significant contributions
- Project documentation

## 📞 Getting Help

If you need help or have questions:

1. Check the [documentation](./docs/)
2. Search existing [issues](https://github.com/your-repo/issues)
3. Create a new issue with the `question` label
4. Contact the maintainers

Thank you for contributing to the Klean Frontend project! 🎉</content>
<parameter name="filePath">c:\Users\DELL\klean-frontend\docs\CONTRIBUTING.md