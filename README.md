# Personal Portfolio

This is my personal portfolio website built to showcase my projects, skills, experience, and background as a Full Stack Developer and Game Developer. It is designed with a modern UI, responsive layout, and multilingual support.

---

## Live Demo

https://jonathan-dorado-portfolio.vercel.app

---

## About the Project

This portfolio was built to present my work as a developer in a clear and structured way. It includes an introduction about myself, featured and side projects, game development prototypes, professional experience, technical and soft skills, and a contact section.

The website focuses on performance, accessibility, responsiveness, and maintainability while providing a modern user experience across desktop and mobile devices. It scores **100** in every Google Lighthouse category on mobile and desktop, and a test checks it on every run.

---

## Tech Stack

- Framework: Astro
- Language: TypeScript / JavaScript
- Styling: Tailwind CSS
- Images: astro:assets + Sharp
- Testing: Node test runner, Puppeteer and Google Lighthouse
- Deployment: Vercel
- Version Control: Git & GitHub

---

## Features

- Multilingual support (English / Spanish) with a one-click language toggle, applied before the first paint so the layout never jumps
- Light and dark themes
- Fully responsive, mobile-first design
- Header that blends into the background at the top and shows a blurred background matching the theme when scrolling, with the active section highlighted
- Featured projects carousel with tabs, autoplay progress bar, swipe and keyboard support
- Collapsible "More projects" section
- Colored status tags (completed, in development, prototype)
- Every technology tag has its logo and links to the official website
- Animated background with particles and waves that changes color for each section and moves with the scroll
- Custom cursor: a glowing orb that turns into a ring over links and buttons, with a smooth comet-like trail
- Satisfying key sound on every button and link (deep "thock" on press, soft tick on release), made with the Web Audio API (no audio files), on desktop and mobile
- Background that reacts subtly to the cursor with a depth parallax
- Sections and cards animate in while scrolling
- Right click disabled
- Lightweight: Latin-only font subsets, icons optimized with SVGO and non-critical scripts loaded when the browser is idle
- Smooth hover transitions on every interactive element
- Respects "reduce motion" system settings
- All icons in a single file, rendered once as an inline SVG sprite

---

## Project Structure

```
src/
├── assets/images/       Screenshots and profile photo (optimized at build time)
├── components/          UI components (one per section plus reusable pieces)
│   ├── header.astro         Header, mobile menu, theme and language toggles
│   ├── hero.astro           About me: introduction, story, photo and key facts
│   ├── projects.astro       Featured carousel + collapsible "More projects"
│   ├── featuredcarousel.astro
│   ├── gamedevelopment.astro
│   ├── experience.astro     Experience timeline
│   ├── skills.astro         Skills sheet: technologies by category, soft skills and languages
│   ├── footer.astro         Contact and credits
│   ├── background.astro     Particles and waves behind the whole page
│   ├── projectcard.astro, techlist.astro, statusbadge.astro, sectionheading.astro
│   └── icon.astro, iconsprite.astro
├── data/
│   ├── projects.ts          Projects (featured: true shows them in the carousel)
│   ├── games.ts             Game prototypes
│   ├── tech.ts              Official link for every technology
│   └── icons.ts             Every SVG icon of the site
├── layouts/mainLayout.astro
├── pages/index.astro
├── scripts/                 Client-side TypeScript (menu, language, theme, carousel,
│                            collapse, background, mouse trail, sounds, context menu)
└── styles/global.css        Theme colors, background, transitions
tests/
└── portfolio.test.mjs       Build + functional test + Google Lighthouse
test.bat                     Double-click test runner for Windows
```

---

## Editing Content

- **Add a project:** add an entry to `src/data/projects.ts` with its image in `src/assets/images/`. Set `featured: true` to show it in the carousel.
- **Add a game:** same as above in `src/data/games.ts`.
- **Translations:** every text has `data-en` and `data-es` attributes. The English text is also written inside the element as the default content.
- **Icons:** add the SVG to `src/data/icons.ts` using the technology name as the key and it will appear automatically in tags and skills. Add its website to `src/data/tech.ts`.

---

## Installation & Setup

Clone the repository:

```bash
git clone https://github.com/Jondals/PortfolioWeb.git
```

Navigate to the project directory:

```bash
cd PortfolioWeb
```

Install dependencies:

```bash
pnpm install
```

Run the development server:

```bash
pnpm run dev
```

Build for production:

```bash
pnpm run build
```

Preview the production build locally:

```bash
pnpm run preview
```

Run the tests:

```bash
pnpm test
```

On Windows you can also double-click `test.bat`.

---

## Testing

`tests/portfolio.test.mjs` is a single end-to-end test that:

- Builds the site with Astro and serves `dist/` with compression (like Vercel).
- Opens the page with Puppeteer and checks that:
  - There are no console errors or failed requests.
  - Every section exists and every icon used is defined.
  - The language toggle works on desktop and in the mobile menu.
  - The carousel and the "More projects" section work, and right click is disabled.
  - The mobile menu overlay covers the whole screen and there is no horizontal scroll on mobile.
- Runs Google Lighthouse on mobile and desktop and requires **100** in Performance, Accessibility, Best Practices and SEO. If something fails, it prints the audits, elements and scripts responsible.

Puppeteer downloads its own Chrome the first time, so no browser needs to be installed.

---

## Deployment

This project is deployed using Vercel. Every push to the main branch automatically triggers a new deployment.
