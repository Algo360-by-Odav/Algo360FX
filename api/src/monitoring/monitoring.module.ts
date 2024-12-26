import { Module } from '@nestjs/common';
import { PrometheusService } from './prometheus.service';
import { MonitoringController } from './monitoring.controller';

@Module({
  controllers: [MonitoringController],
  providers: [PrometheusService],
  exports: [PrometheusService],
})
export class MonitoringModule {}
