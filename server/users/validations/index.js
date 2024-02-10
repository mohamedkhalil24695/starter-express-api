const Joi = require('joi');
const systemRoles = require('../../../common/roles').systemRoles;
const { USER_LOGIN, USER_REGISTER, USER_GET_USERS, USER_UPDATE_USER, USER_GET_USER_BY_ID, USER_DELETE_USER,USER_CHANGE_PASSWORD} = require('../helpers/constants').endPointsConstants;

module.exports = {
 [USER_REGISTER] :{
  body : Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      fullName: Joi.string().required(),
      phoneNumber: Joi.string().required(),
      reportsTarget: Joi.number().optional(),
      role:  Joi.string().valid(...systemRoles).min(1).required() 
    })
  },

  [USER_LOGIN] :
  {
    body : Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
      })
  },

  [USER_GET_USERS]: {
    query: Joi.object({
      page: Joi.number().min(1).optional(),
      limit: Joi.number().optional(),
    }),
  },


  [USER_UPDATE_USER]: {
    params: Joi.object({
      id: Joi.string().required(),
    }),

    body: Joi.object({
      set: Joi.object({
        email: Joi.string().email().optional(),
        password: Joi.string().optional(),
        fullName: Joi.string().optional(),
        phoneNumber: Joi.string().optional(),
        reportsTarget: Joi.number().optional(),
        role:  Joi.string().valid(...systemRoles).min(1).optional()
      }).or("email", "password","fullName","phoneNumber", "role" , "reportsTarget").optional(),
    }).or('set').required()
  },

  [USER_GET_USER_BY_ID]: {
    params: Joi.object({
      id: Joi.string().required(),
    }),
  },

  [USER_DELETE_USER]: {
    params: Joi.object({
      id: Joi.string().required(),
    }),
  },
  
  [USER_CHANGE_PASSWORD]: {
    body: Joi.object({
      oldPassword: Joi.string().required(),
      newPassword: Joi.string().required(),
    }),
  },

}
