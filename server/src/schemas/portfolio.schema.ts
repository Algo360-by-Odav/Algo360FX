import Joi from 'joi';

export const createPortfolioSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional(),
  initialBalance: Joi.number().positive().required(),
  currency: Joi.string().required(),
  riskLevel: Joi.string().valid('low', 'medium', 'high').required(),
  strategies: Joi.array().items(Joi.string()).optional()
});

export const updatePortfolioSchema = Joi.object({
  name: Joi.string().optional(),
  description: Joi.string().optional(),
  riskLevel: Joi.string().valid('low', 'medium', 'high').optional(),
  strategies: Joi.array().items(Joi.string()).optional()
});
