import { join } from 'path';
import type { Config } from 'tailwindcss';

// 1. Import the Skeleton plugin
import { skeleton } from '@skeletonlabs/tw-plugin';

export default {
	// 2. Opt for dark mode to be handled via the class method
	darkMode: 'class',

	content: [
		'./src/**/*.{html,js,svelte,ts}',
		// 3. Append the path to the Skeleton package
		join(require.resolve(
			'@skeletonlabs/skeleton'),
			'../**/*.{html,js,svelte,ts}'
		)
	],

	theme: {
		extend: {}
	},

	plugins: [
		require("@tailwindcss/typography"),
		// 4. Append the Skeleton plugin (after other plugins)
		skeleton
	]
} as Config;
