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

## Testing Offline Mode

1. Use Chrome DevTools to simulate offline mode
2. Or use the "Go Offline" toggle in the app (coming soon)

## Technologies Used

- Next.js 14
- Zustand (state management)
- Dexie.js (IndexedDB)
- Tailwind CSS (styling)

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
