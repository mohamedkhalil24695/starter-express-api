const Joi = require("joi");
const { ReportScale } = require("../helpers/constants");
const {
  REPORT__CREATE_REPORT,
  REPORT__GET_REPORTS_BY_ID,
  REPORT__GET_ALL_REPORTS,
  REPORT__UPDATE_REPORT,
  REPORT__DELETE_REPORT,
  REPORT__GET_DEPARTMENT_ANALYTICS,
  REPORT__GET_REPORTERS_ANALYTICS,
  REPORT__GET_REPORTS_DAILY_ANALYTICS,
  REPORT__EXPORT_ALL_REPORTS,
} = require("../helpers/constants").endPointsConstants;

module.exports = {

  [REPORT__CREATE_REPORT]: {
    body: Joi.object({
      assistorName: Joi.string().optional(),
      creatorId: Joi.number().forbidden(), // creator id is forbidden as it is known from the token
      departmentId: Joi.number().required(),
      areaId: Joi.number().required(),
      NumberOfObservers: Joi.number().optional(),
      comment: Joi.string().optional(),
      actions:Joi.array().items(Joi.object({
        actionId: Joi.number().required() ,
        comment: Joi.string().optional()
      })).min(1).optional(),

      images:Joi.array().items(Joi.string()).min(1).optional(),
      followUpActions:Joi.array().items(Joi.object({
        userId: Joi.number().required() ,
        actionName: Joi.string().required()
      })).min(1).optional(),
    }).required(),
  },

  [REPORT__GET_REPORTS_BY_ID]: {
    params: Joi.object({
      id: Joi.string().required(),
    }),
  },

  [REPORT__GET_ALL_REPORTS]: {
    query: Joi.object({
      page: Joi.number().min(1).optional(),
      limit: Joi.number().optional(),
      name: Joi.string().optional(),
      reportId: Joi.number().optional(),
    }),
  },


  [REPORT__EXPORT_ALL_REPORTS]: {
    query: Joi.object({
      page: Joi.number().min(1).optional(),
      limit: Joi.number().optional(),
      name: Joi.string().optional(),
      reportId: Joi.number().optional(),
    }),
  },

  

  [REPORT__UPDATE_REPORT]: {
    params: Joi.object({
      id: Joi.string().required(),
    }),
    body: Joi.object({ 
      set: Joi.object({
        assistorName: Joi.string().optional(),
        departmentId: Joi.number().optional(),
        areaId: Joi.number().optional(),
        NumberOfObservers: Joi.number().optional(),
        comment: Joi.string().optional(),
      }).or('assistorName','areaId','NumberOfObservers','departmentId','comment').optional(),
    
      unset: Joi.object({
        assistorName: Joi.boolean().optional(),
        NumberOfObservers: Joi.boolean().optional(),
        comment: Joi.string().optional(),
      }).or('assistorName','NumberOfObservers','comment').optional(),
    
      add: Joi.object({
        actions:Joi.array().items(Joi.object({
          actionId: Joi.number().required() ,
          comment: Joi.string().optional()
        })).min(1).optional(),  
        images:Joi.array().items(Joi.string()).min(1).optional(),
        followUpActions:Joi.array().items(Joi.object({
          userId: Joi.number().required() ,
          actionName: Joi.string().required()
        })).min(1).optional(),
      }).or('actions','followUpActions','images').optional(),
    
      remove: Joi.object({
        actions:Joi.array().items(Joi.number()).min(1).optional(),
        followUpActions:Joi.array().items(Joi.number()).min(1).optional(),
        images:Joi.array().items(Joi.number()).min(1).optional(),
      }).or('actions','followUpActions','images').optional(),
    
    }).or('set', 'unset', 'add', 'remove').required()
  },

  [REPORT__DELETE_REPORT]: {
    params: Joi.object({
      id: Joi.string().required(),
    }),
  },

  [REPORT__GET_DEPARTMENT_ANALYTICS]: {
    query: Joi.object({
      createdFrom: Joi.date().optional(),
      createdTo: Joi.date().optional(),
      departmentsIds:Joi.string().regex(/^(\d+,)*\d+$/).optional(),
      page: Joi.number().min(1).optional(),
      limit: Joi.number().optional(),
    }),
  },

  [REPORT__GET_REPORTERS_ANALYTICS]: {
    query: Joi.object({
      createdFrom: Joi.date().optional(),
      createdTo: Joi.date().optional(),
      creatorsIds:Joi.string().regex(/^(\d+,)*\d+$/).optional(),
      page: Joi.number().min(1).optional(),
      limit: Joi.number().optional(),
    }),
  },

  [REPORT__GET_REPORTS_DAILY_ANALYTICS]: {
    query: Joi.object({
      createdFrom: Joi.date().optional(),
      createdTo: Joi.date().optional(),
      page: Joi.number().min(1).optional(),
      limit: Joi.number().optional(),
      groupBy: Joi.string()
      .valid(...ReportScale)
      .required(),

    }),
  },
};
