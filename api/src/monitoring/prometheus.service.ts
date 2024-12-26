import { Injectable, OnModuleInit } from '@nestjs/common';
import * as client from 'prom-client';

@Injectable()
export class PrometheusService implements OnModuleInit {
  private readonly registry: client.Registry;

  constructor() {
    this.registry = new client.Registry();
    client.collectDefaultMetrics({ register: this.registry });
  }

  onModuleInit() {
    // Add custom metrics here
    this.createGauge({
      name: 'websocket_connections',
      help: 'Number of active WebSocket connections',
    });

    this.createGauge({
      name: 'active_users',
      help: 'Number of active users',
    });

    this.createGauge({
      name: 'redis_connected',
      help: 'Redis connection status',
    });
  }

  createCounter(config: client.CounterConfiguration<string>) {
    const counter = new client.Counter(config);
    this.registry.registerMetric(counter);
    return counter;
  }

  createGauge(config: client.GaugeConfiguration<string>) {
    const gauge = new client.Gauge(config);
    this.registry.registerMetric(gauge);
    return gauge;
  }

  createHistogram(config: client.HistogramConfiguration<string>) {
    const histogram = new client.Histogram(config);
    this.registry.registerMetric(histogram);
    return histogram;
  }

  async getMetrics(): Promise<string> {
    return this.registry.metrics();
  }
}
