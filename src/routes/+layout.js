export const prerender = true;
export const trailingSlash = 'always';

import posthog from 'posthog-js'
import { browser } from '$app/environment';

export const load = async () => {

  if (browser) {
    posthog.init(
      'phc_gXl8K7Gu7YCBU5KH6sO8pFy0InNYRWngGdZ4o23KM07',
      { api_host: 'https://us.i.posthog.com' }
    )
  }
  return
};
