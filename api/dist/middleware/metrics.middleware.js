"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricsMiddleware = void 0;
const common_1 = require("@nestjs/common");
const prometheus_service_1 = require("../monitoring/prometheus.service");
let MetricsMiddleware = class MetricsMiddleware {
    constructor(prometheusService) {
        this.prometheusService = prometheusService;
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
    use(request, response, next) {
        const startTime = Date.now();
        const { method, path } = request;
        response.on('finish', () => {
            const duration = (Date.now() - startTime) / 1000;
            const { statusCode } = response;
            const route = this.normalizeRoute(path);
            this.httpRequestDuration.observe({ method, route, status_code: statusCode }, duration);
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
    normalizeRoute(path) {
        return path.replace(/\/[0-9a-f-]{36,}/g, '/:id');
    }
};
exports.MetricsMiddleware = MetricsMiddleware;
exports.MetricsMiddleware = MetricsMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prometheus_service_1.PrometheusService])
], MetricsMiddleware);
//# sourceMappingURL=metrics.middleware.js.map