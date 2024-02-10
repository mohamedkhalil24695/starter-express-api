const Joi = require("joi");
const {
  REPORT_FUA__GET_REPORT_FOLLOW_UP_ACTION_BY_ID,
  REPORT_FUA__GET_ALL_REPORT_FOLLOW_UP_ACTIONS,
  REPORT_FUA__UPDATE_FOLLOW_UP_ACTION,
  REPORT_FUA__DONE_INPROGRESS_ANALYTICS,
} = require("../helpers/constants").endPointsConstants;

module.exports = {


  [REPORT_FUA__GET_REPORT_FOLLOW_UP_ACTION_BY_ID]: {
    params: Joi.object({
      id: Joi.string().required(),
    }),
  },

  [REPORT_FUA__GET_ALL_REPORT_FOLLOW_UP_ACTIONS]: {
    query: Joi.object({
      page: Joi.number().min(1).optional(),
      limit: Joi.number().optional(),
      referenceId: Joi.number().optional(),
      createdFrom: Joi.date().optional(),
      createdTo: Joi.date().optional(),
      deadLineFrom: Joi.date().optional(),
      deadLineTo:Joi.date().optional(),
      actionName: Joi.string().optional(),
      reportId: Joi.number().optional(),
      byWhomId: Joi.number().optional(),
      departmentId: Joi.number().optional(),
      state: Joi.string().valid(...['DONE','inProgress']).optional(),
    }),
  },


  [REPORT_FUA__UPDATE_FOLLOW_UP_ACTION]: {
    params: Joi.object({
      id: Joi.string().required(),
    }),
    body: Joi.object({ 
      set: Joi.object({
        state: Joi.string().optional(),
        deadLine: Joi.date().optional(),
      }).or('state','deadLine').required(),
  })
},


[REPORT_FUA__DONE_INPROGRESS_ANALYTICS]: {
  query: Joi.object({
    createdFrom: Joi.date().optional(),
    createdTo: Joi.date().optional(),
    deadLineFrom: Joi.date().optional(),
    deadLineTo:Joi.date().optional(),
    reportId: Joi.number().optional(),
    byWhomId: Joi.number().optional(),
    departmentId: Joi.number().optional(),
  }),
},

};
