import type { PageLoad } from './$types';
import page from './index.html?raw';

export const load = (async () => {
    return {
        page
    };
}) satisfies PageLoad;

export const csr = false;
