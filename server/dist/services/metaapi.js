"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMetaApiConnection = getMetaApiConnection;
const metaapi_cloud_sdk_1 = __importDefault(require("metaapi.cloud-sdk"));
const config_1 = require("../config/config");
// Initialize MetaAPI with retry mechanism
const api = new metaapi_cloud_sdk_1.default(config_1.config.metaApiToken);
// Cache for MetaAPI connections
let cachedConnection = null;
async function getMetaApiConnection() {
    try {
        if (!cachedConnection) {
            console.log('Initializing MetaAPI connection...');
            // Create MT5 account instance
            const account = await api.metatraderAccountApi.getAccount(config_1.config.mt5AccountId);
            if (!account) {
                throw new Error('MT5 account not found');
            }
            console.log('MT5 account found, deploying...');
            // Deploy account
            const deployedAccount = await account.deploy();
            console.log('Account deployed, waiting for connection...');
            // Wait until account is deployed and connected to broker
            await deployedAccount.waitConnected();
            console.log('Account connected to broker');
            // Get connection instance
            cachedConnection = await deployedAccount.getStreamingConnection();
            await cachedConnection.connect();
            await cachedConnection.waitSynchronized();
            console.log('MetaAPI connection established and synchronized');
        }
        return cachedConnection;
    }
    catch (error) {
        console.error('MetaAPI connection error:', error);
        throw error;
    }
}
