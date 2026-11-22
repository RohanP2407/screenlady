// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://admin.accoladescreenlady.com',
  server: {
    port: 4322,
    host: true
  }
});
