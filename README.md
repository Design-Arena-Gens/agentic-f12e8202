## Legend Atlas

Legend Atlas is a cinematic character mastery hub built with Next.js and Tailwind CSS. Explore animated dossier cards, drill into advanced ability breakdowns, and contribute community fan art for every featured hero.

### Highlights

- Animated glassmorphism character cards with role, difficulty, and tag filters.
- Deep-dive mastery section with curated guides, execution steps, and pro tips.
- Community fan art submission flow with local persistence and instant gallery updates.
- Responsive layout tuned for desktop, tablet, and mobile breakpoints.

### Tech Stack

- [Next.js](https://nextjs.org/) App Router with TypeScript.
- Tailwind CSS with custom design tokens and animations.
- Local storage persistence for community submissions.

### Local Development

```bash
npm install
npm run dev
```

The site will be available at [http://localhost:3000](http://localhost:3000).

### Scripts

- `npm run dev` – start a local development server.
- `npm run build` – create an optimized production build.
- `npm run start` – serve the production build locally.
- `npm run lint` – run ESLint using the Next.js configuration.

### Deployment

The project is optimized for Vercel. After verifying locally, deploy with:

```bash
vercel deploy --prod --yes --token $VERCEL_TOKEN --name agentic-f12e8202
```
