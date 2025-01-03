import Joi from 'joi';

export const searchSchema = Joi.object({
  query: Joi.string().required(),
  type: Joi.string().valid('analytics', 'documentation', 'portfolios', 'strategies', 'all').default('all')
});
