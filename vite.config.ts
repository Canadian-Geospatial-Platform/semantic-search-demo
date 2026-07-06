import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { paraglideVitePlugin } from '@inlang/paraglide-js';

export default defineConfig({
	plugins: [sveltekit(), , 
              paraglideVitePlugin({
                  project: "./project.inlang",
                  outdir: "./src/paraglide"
              })],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
