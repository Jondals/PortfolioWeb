// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://jonathan-dorado-portfolio.vercel.app',
  build: {
    // CSS inline: evita una petición bloqueante y mejora el LCP en móvil
    inlineStylesheets: 'always'
  },
  vite: {
    plugins: [tailwindcss()]
  }
});
