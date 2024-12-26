"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrometheusService = void 0;
const common_1 = require("@nestjs/common");
const client = __importStar(require("prom-client"));
let PrometheusService = class PrometheusService {
    constructor() {
        this.registry = new client.Registry();
        client.collectDefaultMetrics({ register: this.registry });
    }
    onModuleInit() {
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
    createCounter(config) {
        const counter = new client.Counter(config);
        this.registry.registerMetric(counter);
        return counter;
    }
    createGauge(config) {
        const gauge = new client.Gauge(config);
        this.registry.registerMetric(gauge);
        return gauge;
    }
    createHistogram(config) {
        const histogram = new client.Histogram(config);
        this.registry.registerMetric(histogram);
        return histogram;
    }
    async getMetrics() {
        return this.registry.metrics();
    }
};
exports.PrometheusService = PrometheusService;
exports.PrometheusService = PrometheusService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PrometheusService);
//# sourceMappingURL=prometheus.service.js.map