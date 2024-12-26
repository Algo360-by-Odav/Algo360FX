import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Counter, Histogram } from 'prom-client';
import { PrometheusService } from '../monitoring/prometheus.service';

@Injectable()
export class MetricsMiddleware implements NestMiddleware {
  private readonly httpRequestDuration: Histogram;
  private readonly httpRequestTotal: Counter;
  private readonly httpRequestErrors: Counter;

  constructor(private readonly prometheusService: PrometheusService) {
    this.httpRequestDuration = this.prometheusService.createHistogram({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route', 'status_code'],
      buckets: [0.1, 0.5, 1, 2, 5],
    });

    this.httpRequestTotal = this.prometheusService.createCounter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status_code'],
    });

    this.httpRequestErrors = this.prometheusService.createCounter({
      name: 'http_request_errors_total',
      help: 'Total number of HTTP request errors',
      labelNames: ['method', 'route', 'status_code'],
    });
  }

  use(request: Request, response: Response, next: NextFunction): void {
    const startTime = Date.now();
    const { method, path } = request;

    response.on('finish', () => {
      const duration = (Date.now() - startTime) / 1000;
      const { statusCode } = response;
      const route = this.normalizeRoute(path);

      // Record metrics
      this.httpRequestDuration.observe(
        { method, route, status_code: statusCode },
        duration,
      );

      this.httpRequestTotal.inc({
        method,
        route,
        status_code: statusCode,
      });

      if (statusCode >= 400) {
        this.httpRequestErrors.inc({
          method,
          route,
          status_code: statusCode,
        });
      }
    });

    next();
  }

  private normalizeRoute(path: string): string {
    // Replace route parameters with placeholders
    return path.replace(/\/[0-9a-f-]{36,}/g, '/:id');
  }
}
