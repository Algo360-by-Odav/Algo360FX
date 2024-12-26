import * as Sentry from '@sentry/node';
import { ProfilingIntegration } from '@sentry/profiling-node';
import { ConfigService } from '@nestjs/config';
import { INestApplication } from '@nestjs/common';

export function setupSentry(app: INestApplication) {
  const configService = app.get(ConfigService);
  const dsn = configService.get('SENTRY_DSN');
  const environment = configService.get('NODE_ENV');

  if (!dsn) {
    console.warn('Sentry DSN not found. Error tracking will be disabled.');
    return;
  }

  Sentry.init({
    dsn,
    environment,
    integrations: [
      new ProfilingIntegration(),
    ],
    tracesSampleRate: environment === 'production' ? 0.1 : 1.0,
    profilesSampleRate: environment === 'production' ? 0.1 : 1.0,
  });
}
