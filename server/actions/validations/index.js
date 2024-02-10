const Joi = require("joi");
const { reportActions } = require("../helpers/constants");
const {
  ACTION__CREATE_ACTION,
  ACTION__GET_ALL_ACTIONS_NAMES,
  ACTION__GET_ALL_ACTIONS,
  ACTION__UPDATE_ACTION,
  ACTION__DELETE_ACTION,
} = require("../helpers/constants").endPointsConstants;

module.exports = {
  [ACTION__CREATE_ACTION]: {
    body: Joi.object({
      name: Joi.string().required(),
      nameAr: Joi.string().optional(),
      type: Joi.string()
        .valid(...reportActions)
        .required(),
    }),
  },

  [ACTION__GET_ALL_ACTIONS_NAMES]: {
    query: Joi.object({
      page: Joi.number().min(1).optional(),
      limit: Joi.number().optional(),
      name: Joi.string().optional(),
      nameAr: Joi.string().optional(),
      type: Joi.string()
        .valid(...reportActions)
        .optional(),
    }),
  },

  [ACTION__GET_ALL_ACTIONS]: {
    query: Joi.object({
      page: Joi.number().min(1).optional(),
      limit: Joi.number().optional(),
      name: Joi.string().optional(),
      nameAr: Joi.string().optional(),
      type: Joi.string()
        .valid(...reportActions)
        .optional(),
    }),
  },

  [ACTION__UPDATE_ACTION]: {
    params: Joi.object({
      id: Joi.string().required(),
    }),
    body: Joi.object({
      set: Joi.object({
        name: Joi.string().optional(),
        type: Joi.string().optional(),
        nameAr: Joi.string().optional(),
      }).or("name", "type" , "nameAr").optional(),
    }).or('set').required()
  },

  [ACTION__DELETE_ACTION]: {
    params: Joi.object({
      id: Joi.string().required(),
    }),
  },
};
