"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMetaApiConnection = getMetaApiConnection;
const metaapi_cloud_sdk_1 = __importDefault(require("metaapi.cloud-sdk"));
const config_1 = require("../config");
const api = new metaapi_cloud_sdk_1.default(config_1.config.metaApiToken);
let cachedConnection = null;
let lastConnectionTime = 0;
const CONNECTION_TIMEOUT = 5 * 60 * 1000;
async function getMetaApiConnection() {
    const now = Date.now();
    if (cachedConnection && (now - lastConnectionTime) < CONNECTION_TIMEOUT) {
        return cachedConnection;
    }
    for (let attempt = 1; attempt <= config_1.config.metaApiRetryAttempts; attempt++) {
        try {
            const accounts = await api.metatraderAccountApi.getAccounts();
            console.log('Available accounts:', accounts.map(acc => ({
                id: acc.id,
                login: acc.login,
                name: acc.name,
                type: acc.type,
                state: acc.state
            })));
            cachedConnection = api;
            lastConnectionTime = now;
            return cachedConnection;
        }
        catch (error) {
            console.error(`Connection attempt ${attempt} failed:`, error);
            if (attempt === config_1.config.metaApiRetryAttempts) {
                throw error;
            }
            await new Promise(resolve => setTimeout(resolve, config_1.config.metaApiRetryDelay));
        }
    }
}
//# sourceMappingURL=metaapi.js.map