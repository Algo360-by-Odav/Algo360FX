import { Controller, Get } from '@nestjs/common';
import { PrometheusService } from './prometheus.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('monitoring')
@Controller('metrics')
export class MonitoringController {
  constructor(private readonly prometheusService: PrometheusService) {}

  @Get()
  @ApiOperation({ summary: 'Get application metrics' })
  async getMetrics(): Promise<string> {
    return this.prometheusService.getMetrics();
  }
}
