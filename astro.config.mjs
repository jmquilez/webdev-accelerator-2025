// @ts-check
import { defineConfig, envField } from 'astro/config';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),
  env: {
    schema: {
      N2YO_API_KEY: envField.string({
        context: "client",
        access: "public",
        optional: true,
        default: "DEMO_KEY"
      })
    }
  }
});
