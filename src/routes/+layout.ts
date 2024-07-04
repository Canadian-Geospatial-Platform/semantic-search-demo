export const prerender = true;
export const trailingSlash = 'always';

import "posthog-js/dist/recorder";
import "posthog-js/dist/surveys";
// import "posthog-js/dist/exception-autocapture";
import "posthog-js/dist/tracing-headers";
import "posthog-js/dist/web-vitals";
import posthog from 'posthog-js';

import { browser } from '$app/environment';

export const load = async () => {
  if (browser) {
    if (!window.location.host.includes('127.0.0.1') && !window.location.host.includes('localhost')) {
      posthog.init('phc_gXl8K7Gu7YCBU5KH6sO8pFy0InNYRWngGdZ4o23KM07', {
        api_host: 'https://us.i.posthog.com',
        disable_external_dependency_loading: true, // Optional - will ensure we never try to load extensions lazily
        session_recording: {
          maskAllInputs: false,
          maskInputOptions: {
            password: true
          }
        }
      });
    }
  }
  return;
};

export const _frontmatter = {}
