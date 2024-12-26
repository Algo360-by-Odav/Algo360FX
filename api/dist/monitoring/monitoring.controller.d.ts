import { PrometheusService } from './prometheus.service';
export declare class MonitoringController {
    private readonly prometheusService;
    constructor(prometheusService: PrometheusService);
    getMetrics(): Promise<string>;
}
