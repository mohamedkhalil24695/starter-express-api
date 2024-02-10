const Joi = require("joi");
const {
  AREA__CREATE_AREA,
  AREA__GET_ALL_AREAS_NAMES,
  AREA__GET_ALL_AREAS,
  AREA__UPDATE_AREA,
  AREA__DELETE_AREA,
} = require("../helpers/constants").endPointsConstants;

module.exports = {
  [AREA__CREATE_AREA]: {
    body: Joi.object({
      name: Joi.string().required(),
    }),
  },

  [AREA__GET_ALL_AREAS_NAMES]: {
    query: Joi.object({
      page: Joi.number().min(1).optional(),
      limit: Joi.number().optional(),
      name: Joi.string().optional(),
    }),
  },
  [AREA__GET_ALL_AREAS]: {
    query: Joi.object({
      page: Joi.number().min(1).optional(),
      limit: Joi.number().optional(),
      name: Joi.string().optional(),
    }),
  },

  [AREA__UPDATE_AREA]: {
    params: Joi.object({
      id: Joi.string().required(),
    }),
    body: Joi.object({
      set: Joi.object({
        name: Joi.string().optional(),
      }).or('name').optional(),
    }).or('set').required()
  },


  [AREA__DELETE_AREA]: {
    params: Joi.object({
      id: Joi.string().required(),
    }),
  },
  
};
 