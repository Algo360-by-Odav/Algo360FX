import Joi from 'joi';

export const createStrategySchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional(),
  type: Joi.string().valid('manual', 'automated', 'hybrid').required(),
  timeframe: Joi.string().valid('M1', 'M5', 'M15', 'M30', 'H1', 'H4', 'D1', 'W1', 'MN').required(),
  symbols: Joi.array().items(Joi.string()).required(),
  parameters: Joi.object().required(),
  entryRules: Joi.array().items(Joi.string()).required(),
  exitRules: Joi.array().items(Joi.string()).required(),
  riskManagement: Joi.object({
    maxLotSize: Joi.number().required(),
    maxRiskPerTrade: Joi.number().required(),
    maxOpenTrades: Joi.number().required()
  }).required()
});

export const updateStrategySchema = Joi.object({
  name: Joi.string().optional(),
  description: Joi.string().optional(),
  timeframe: Joi.string().valid('M1', 'M5', 'M15', 'M30', 'H1', 'H4', 'D1', 'W1', 'MN').optional(),
  symbols: Joi.array().items(Joi.string()).optional(),
  parameters: Joi.object().optional(),
  entryRules: Joi.array().items(Joi.string()).optional(),
  exitRules: Joi.array().items(Joi.string()).optional(),
  riskManagement: Joi.object({
    maxLotSize: Joi.number().optional(),
    maxRiskPerTrade: Joi.number().optional(),
    maxOpenTrades: Joi.number().optional()
  }).optional()
});
