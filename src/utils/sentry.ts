import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;

export const initSentry = () => {
  if (SENTRY_DSN) {
    Sentry.init({
      dsn: SENTRY_DSN,
      integrations: [new Integrations.BrowserTracing()],
      tracesSampleRate: import.meta.env.MODE === 'production' ? 0.1 : 1.0,
      environment: import.meta.env.MODE,
    });
  }
};

export const captureException = (error: Error, context?: Record<string, unknown>) => {
  if (SENTRY_DSN) {
    Sentry.captureException(error, {
      extra: context,
    });
  } else {
    console.error('Error:', error, context);
  }
};

export const captureMessage = (message: string, level: Sentry.SeverityLevel = 'info') => {
  if (SENTRY_DSN) {
    Sentry.captureMessage(message, level);
  } else {
    console.log(`${level.toUpperCase()}: ${message}`);
  }
};

export const setUser = (user: { id: string; email?: string; username?: string }) => {
  if (SENTRY_DSN) {
    Sentry.setUser(user);
  }
};

export const clearUser = () => {
  if (SENTRY_DSN) {
    Sentry.setUser(null);
  }
};
