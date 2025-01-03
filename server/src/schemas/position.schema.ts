import Joi from 'joi';

export const createPositionSchema = Joi.object({
  symbol: Joi.string().required(),
  type: Joi.string().valid('buy', 'sell').required(),
  lotSize: Joi.number().min(0.01).max(100).required(),
  openPrice: Joi.number().positive().required(),
  stopLoss: Joi.number().positive().optional(),
  takeProfit: Joi.number().positive().optional(),
  strategy: Joi.string().optional(),
  portfolio: Joi.string().required(),
  timestamp: Joi.date().default(() => new Date()),
  status: Joi.string().valid('open', 'closed', 'pending').default('open')
});

export const updatePositionSchema = Joi.object({
  stopLoss: Joi.number().positive().optional(),
  takeProfit: Joi.number().positive().optional(),
  status: Joi.string().valid('open', 'closed', 'pending').optional(),
  notes: Joi.string().optional(),
  closePrice: Joi.number().positive().when('status', {
    is: 'closed',
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
  closedAt: Joi.date().when('status', {
    is: 'closed',
    then: Joi.required(),
    otherwise: Joi.optional()
  })
});
