# Local-First User Directory

A Next.js application with offline-first capabilities using Zustand for state management and Dexie.js for IndexedDB caching.

## Features

- Fetches user data from randomuser.me API
- Caches data locally using IndexedDB
- Works offline with cached data
- Mark users as favorites
- Responsive UI with Tailwind CSS

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Visit http://localhost:3000


## Testing

The project uses Vitest with Testing Library for component tests.

### Running Tests
```bash
# Run tests once
npm test

# Run in watch mode
npm run test:watch

# Run with coverage report
npm run test:coverage

# Open test UI
npm run test:ui
```

### Linting
```bash
npm run lint
```

Example test commands:
```bash
# Run specific test file
npm test src/components/__tests__/OfflineBanner.test.tsx

# Update snapshots
npm test -- -u
```

## Testing Offline Mode

1. Use Chrome DevTools to simulate offline mode
2. Or use the "Go Offline" toggle in the app (coming soon)


## What I would have done next

There are many things I would have done next if I had the time.
For one, I would have liked to add more comprehensive tests and get high test coverage.

I would also have liked to do more manual testing of the app to look for
issues.

There are linting errors which I would have liked to fix.

I would also have liked to go over the code and do some more quality control
and checking that everything looks OK.

