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
exports.RedisService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const redis_1 = require("redis");
let RedisService = class RedisService {
    constructor(configService) {
        this.configService = configService;
        this.client = (0, redis_1.createClient)({
            url: this.configService.get('REDIS_URL'),
        });
        this.client.on('error', (error) => {
            console.error('Redis Client Error:', error);
        });
    }
    async onModuleInit() {
        await this.client.connect();
    }
    async onModuleDestroy() {
        await this.client.quit();
    }
    async set(key, value, ttl) {
        if (ttl) {
            await this.client.set(key, value, { EX: ttl });
        }
        else {
            await this.client.set(key, value);
        }
    }
    async get(key) {
        return this.client.get(key);
    }
    async del(key) {
        return this.client.del(key);
    }
    async exists(key) {
        return this.client.exists(key);
    }
    async setHash(key, field, value) {
        return this.client.hSet(key, field, value);
    }
    async getHash(key, field) {
        return this.client.hGet(key, field);
    }
    async getAllHash(key) {
        return this.client.hGetAll(key);
    }
    async delHash(key, field) {
        return this.client.hDel(key, field);
    }
    async setWithExpiry(key, value, seconds) {
        return this.client.set(key, value, { EX: seconds });
    }
    async invalidatePattern(pattern) {
        const keys = await this.client.keys(pattern);
        if (keys.length > 0) {
            return this.client.del(keys);
        }
        return 0;
    }
};
exports.RedisService = RedisService;
exports.RedisService = RedisService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], RedisService);
//# sourceMappingURL=redis.service.js.map