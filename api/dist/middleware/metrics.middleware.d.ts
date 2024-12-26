import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrometheusService } from '../monitoring/prometheus.service';
export declare class MetricsMiddleware implements NestMiddleware {
    private readonly prometheusService;
    private readonly httpRequestDuration;
    private readonly httpRequestTotal;
    private readonly httpRequestErrors;
    constructor(prometheusService: PrometheusService);
    use(request: Request, response: Response, next: NextFunction): void;
    private normalizeRoute;
}
