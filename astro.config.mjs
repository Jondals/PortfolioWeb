// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://jonathan-dorado-portfolio.vercel.app',
  build: {
    // Inline CSS: avoids a render-blocking request and improves LCP on mobile
    inlineStylesheets: 'always'
  },
  vite: {
    plugins: [tailwindcss()]
  }
});
