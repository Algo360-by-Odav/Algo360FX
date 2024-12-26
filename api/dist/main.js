"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const compression_1 = __importDefault(require("compression"));
const helmet_1 = __importDefault(require("helmet"));
const app_module_1 = require("./app.module");
const config_1 = require("@nestjs/config");
const sentry_config_1 = require("./config/sentry.config");
const logger_config_1 = require("./config/logger.config");
const logging_middleware_1 = require("./middleware/logging.middleware");
const metrics_middleware_1 = require("./middleware/metrics.middleware");
const prometheus_service_1 = require("./monitoring/prometheus.service");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: (0, logger_config_1.setupLogger)(),
    });
    const configService = app.get(config_1.ConfigService);
    const prometheusService = app.get(prometheus_service_1.PrometheusService);
    (0, sentry_config_1.setupSentry)(app);
    app.use((0, helmet_1.default)());
    app.use((0, compression_1.default)());
    app.enableCors({
        origin: configService.get('CORS_ORIGIN', '*').split(','),
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        credentials: true,
    });
    app.use(new logging_middleware_1.LoggingMiddleware().use);
    app.use(new metrics_middleware_1.MetricsMiddleware(prometheusService).use);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Algo360FX API')
        .setDescription('The Algo360FX API documentation')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('docs', app, document);
    const port = configService.get('PORT', 8080);
    await app.listen(port);
    console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
//# sourceMappingURL=main.js.map