import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { paraglide } from '@inlang/paraglide-vite';

export default defineConfig({
	plugins: [sveltekit(), paraglide()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
