import * as Sentry from '@sentry/react';

export const initSentry = () => {
  if (process.env.NODE_ENV === 'production') {
    Sentry.init({
      dsn: process.env.VITE_SENTRY_DSN,
      integrations: [
        new Sentry.BrowserTracing({
          tracePropagationTargets: ['localhost', /^https:\/\/[^/]*algo360fx\.vercel\.app/],
        }),
        new Sentry.Replay(),
      ],
      tracesSampleRate: 1.0,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
    });
  }
};

export const captureException = (error: Error, context?: Record<string, any>) => {
  if (process.env.NODE_ENV === 'production') {
    Sentry.captureException(error, {
      extra: context,
    });
  } else {
    console.error('Error:', error, '\nContext:', context);
  }
};

export const setUserContext = (userId: string, email?: string) => {
  Sentry.setUser({
    id: userId,
    email,
  });
};

export const clearUserContext = () => {
  Sentry.setUser(null);
};
