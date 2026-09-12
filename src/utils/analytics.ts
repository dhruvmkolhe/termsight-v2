/**
 * TermSight Analytics & Telemetry Adapter
 *
 * Provides privacy-conscious event and page tracking.
 * Pluggable with Plausible, Fathom, Google Analytics (GA4), or a custom backend.
 */

// TODO: Insert your production GA4 Measurement ID (e.g. 'G-XXXXXXXXXX') or configure Plausible domain
export const GA_MEASUREMENT_ID = (import.meta.env.VITE_GA_MEASUREMENT_ID as string) || '';
export const PLAUSIBLE_DOMAIN = (import.meta.env.VITE_PLAUSIBLE_DOMAIN as string) || '';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    plausible?: (eventName: string, options?: { props?: Record<string, unknown> }) => void;
  }
}

/**
 * Initializes analytics providers if keys are configured.
 */
export function initAnalytics(): void {
  if (typeof window === 'undefined') return;

  // Initialize GA4 if measurement ID is supplied
  if (GA_MEASUREMENT_ID && !window.gtag) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function (...args: unknown[]) {
      window.dataLayer?.push(args);
    };
    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID, {
      anonymize_ip: true,
      send_page_view: true,
    });
  }

  // Initialize Plausible if domain is supplied
  if (PLAUSIBLE_DOMAIN && !window.plausible) {
    const script = document.createElement('script');
    script.defer = true;
    script.setAttribute('data-domain', PLAUSIBLE_DOMAIN);
    script.src = 'https://plausible.io/js/script.js';
    document.head.appendChild(script);
  }
}

/**
 * Tracks virtual page/mode view
 */
export function trackPageView(path: string, title?: string): void {
  if (typeof window === 'undefined') return;

  if (window.gtag && GA_MEASUREMENT_ID) {
    window.gtag('event', 'page_view', {
      page_path: path,
      page_title: title || document.title,
    });
  }

  if (window.plausible) {
    window.plausible('pageview', { props: { path, title: title || document.title } });
  }

  // Dispatch custom DOM event for testing and local inspection
  window.dispatchEvent(
    new CustomEvent('termsight:pageview', { detail: { path, title: title || document.title } })
  );
}

/**
 * Tracks custom user interactions and CTAs
 */
export function trackEvent(eventName: string, properties: Record<string, unknown> = {}): void {
  if (typeof window === 'undefined') return;

  if (window.gtag) {
    window.gtag('event', eventName, properties);
  }

  if (window.plausible) {
    window.plausible(eventName, { props: properties });
  }

  // Custom DOM event for local event auditing
  window.dispatchEvent(
    new CustomEvent('termsight:event', { detail: { eventName, properties } })
  );
}

/**
 * Specifically tracks 404 page impressions in analytics
 */
export function track404(attemptedPath: string): void {
  trackEvent('error_404', {
    attempted_path: attemptedPath,
    referrer: document.referrer || 'direct',
  });
}

/**
 * Tracks key Call-To-Action (CTA) click events
 */
export function trackCta(ctaName: string, meta: Record<string, unknown> = {}): void {
  trackEvent('cta_click', {
    cta: ctaName,
    timestamp: Date.now(),
    ...meta,
  });
}
