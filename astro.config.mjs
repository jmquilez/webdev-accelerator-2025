// @ts-check
import { defineConfig, envField } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  env: {
    schema: {N2YO_API_KEY: envField.string({context: "client",
      access: "public",
      optional: true,
      default: "pito"})
    }
  }
});
