import Joi from 'joi';

export const userSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  role: Joi.string().valid('user', 'admin').default('user'),
  preferences: Joi.object({
    theme: Joi.string().valid('light', 'dark').default('light'),
    notifications: Joi.boolean().default(true),
    timezone: Joi.string().default('UTC'),
    defaultCurrency: Joi.string().default('USD'),
  }).optional()
});

export const updateUserSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(8).optional(),
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  preferences: Joi.object({
    theme: Joi.string().valid('light', 'dark').optional(),
    notifications: Joi.boolean().optional(),
    timezone: Joi.string().optional(),
    defaultCurrency: Joi.string().optional(),
  }).optional()
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

export const updatePreferencesSchema = Joi.object({
  theme: Joi.string().valid('light', 'dark').optional(),
  notifications: Joi.boolean().optional(),
  language: Joi.string().valid('en', 'es', 'fr', 'de', 'zh').optional(),
  riskLevel: Joi.string().valid('low', 'medium', 'high').optional(),
  defaultLotSize: Joi.number().min(0.01).max(100).optional(),
  tradingPairs: Joi.array().items(Joi.string()).optional()
});
