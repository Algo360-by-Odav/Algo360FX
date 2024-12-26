import { OnModuleInit } from '@nestjs/common';
import * as client from 'prom-client';
export declare class PrometheusService implements OnModuleInit {
    private readonly registry;
    constructor();
    onModuleInit(): void;
    createCounter(config: client.CounterConfiguration<string>): client.Counter<string>;
    createGauge(config: client.GaugeConfiguration<string>): client.Gauge<string>;
    createHistogram(config: client.HistogramConfiguration<string>): client.Histogram<string>;
    getMetrics(): Promise<string>;
}
