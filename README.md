# E2E Testing Project

This project contains end-to-end tests using Playwright.

## Project Structure

```
tests/
├── api/           # API testing setup and tests
├── data/          # Test data and constants
├── e2e/           # End-to-end test files
├── fixtures/      # Test fixtures (auth, etc.)
├── pages/         # Page object models
└── utils/         # Utility functions
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Run tests:
```bash
npx playwright test
```

## Running Tests

- Run all tests:
```bash
npx playwright test
```

- Run specific test file:
```bash
npx playwright test tests/e2e/example.spec.ts
```

- Run tests in UI mode:
```bash
npx playwright test --ui
```

## Development

- Page Object Model pattern is used for better maintainability
- Fixtures are used for common setup (like authentication)
- Test data is centralized in the data directory
- Utility functions are available in the utils directory
