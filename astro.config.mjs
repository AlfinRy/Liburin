// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import { DEFAULT_YEAR } from './src/lib/year';

import cloudflare from '@astrojs/cloudflare';

// https://docs.astro.build/config
export default defineConfig({
  redirects: {
      '/': `/${DEFAULT_YEAR}`,
      '/rekomendasi': `/${DEFAULT_YEAR}/rekomendasi`,
      '/kalender-tahunan': `/${DEFAULT_YEAR}/kalender-tahunan`,
      '/hitung-cuti': `/${DEFAULT_YEAR}/hitung-cuti`,
  },

  vite: {
      plugins: [tailwindcss()]
  },

  adapter: cloudflare()
});