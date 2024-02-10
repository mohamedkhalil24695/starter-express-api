const Joi = require("joi");
const {
  DEPARTMENT__CREATE_DEPARTMENT,
  DEPARTMENT__GET_ALL_DEPARTMENTS_NAMES,
  DEPARTMENT__GET_ALL_DEPARTMENTS,
  DEPARTMENT__UPDATE_DEPARTMENT,
  DEPARTMENT__DELETE_DEPARTMENT,
} = require("../helpers/constants").endPointsConstants;

module.exports = {
  [DEPARTMENT__CREATE_DEPARTMENT]: {
    body: Joi.object({
      name: Joi.string().required(),
      nameAr: Joi.string().optional(),
    }),
  },

  [DEPARTMENT__GET_ALL_DEPARTMENTS_NAMES]: {
    query: Joi.object({
      page: Joi.number().min(1).optional(),
      limit: Joi.number().optional(),
      name: Joi.string().optional(),
      nameAr: Joi.string().optional(),
    }),
  },
  [DEPARTMENT__GET_ALL_DEPARTMENTS]: {
    query: Joi.object({
      page: Joi.number().min(1).optional(),
      limit: Joi.number().optional(),
      name: Joi.string().optional(),
      nameAr: Joi.string().optional(),
    }),
  },

  [DEPARTMENT__UPDATE_DEPARTMENT]: {
    params: Joi.object({
      id: Joi.string().required(),
    }),
    body: Joi.object({
      set: Joi.object({
        name: Joi.string().optional(),
        nameAr: Joi.string().optional(),
      }).or('name','nameAr').optional(),
    }).or('set').required()
  },


  [DEPARTMENT__DELETE_DEPARTMENT]: {
    params: Joi.object({
      id: Joi.string().required(),
    }),
  },
  
};
