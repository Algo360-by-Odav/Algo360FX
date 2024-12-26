import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import compression from 'compression';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { setupSentry } from './config/sentry.config';
import { setupLogger } from './config/logger.config';
import { LoggingMiddleware } from './middleware/logging.middleware';
import { MetricsMiddleware } from './middleware/metrics.middleware';
import { PrometheusService } from './monitoring/prometheus.service';

async function bootstrap() {
  // Create app with Winston logger
  const app = await NestFactory.create(AppModule, {
    logger: setupLogger(),
  });

  const configService = app.get(ConfigService);
  const prometheusService = app.get(PrometheusService);

  // Setup Sentry
  setupSentry(app);

  // Security
  app.use(helmet.default());
  app.use(compression());
  app.enableCors({
    origin: configService.get('CORS_ORIGIN', '*').split(','),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  // Middleware
  app.use(new LoggingMiddleware().use);
  app.use(new MetricsMiddleware(prometheusService).use);

  // Validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  // API Documentation
  const config = new DocumentBuilder()
    .setTitle('Algo360FX API')
    .setDescription('The Algo360FX API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // Start server
  const port = configService.get('PORT', 8080);
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
