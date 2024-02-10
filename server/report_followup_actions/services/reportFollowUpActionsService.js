const { reporterRole } = require("../../../common/roles");
const reportFollowUpActionsModel = require("../model/index");
const _ = require("lodash");

async function createSingleReportFollowUpAction(reportId, userId, actionId) {
  try {

    const newReportFollowUpAction = await reportFollowUpActionsModel.create({reportId, 
      actionId,
      userId,
    });
    return newReportFollowUpAction;
  } catch (error) {
    throw new Error(error);
  }
}


async function createBulkReportFollowUpAction(reportId, followUpActions, transaction) {
  try {
   
    const newReportFollowUpAction = await reportFollowUpActionsModel.bulkCreate(reportId, followUpActions, transaction)
    return newReportFollowUpAction;
  } catch (error) {
    throw new Error(error);
  }
}


async function validateReportFollowUpActions(followUpActionsIds, reportId) {
  try {

    const actions = await reportFollowUpActionsModel.findAll(
      {
        id: followUpActionsIds,
        reportId: reportId 
      },
      ['id'],
    );

    if (!actions) {
      return false;
    }

    const existedActionsIds = actions.map(action=>action.id);

    if(followUpActionsIds.length != existedActionsIds.length ){
      return false;
    }

    return actions;
  } catch (error) {
    throw  new Error(error);
  }
}

async function deleteReportFollowUpActions(followUpActionsIds , reportId, transaction) {
  try {
   
    await reportFollowUpActionsModel.destroy({
      id: followUpActionsIds,
      reportId
    }, transaction)
  } catch (error) {
    throw new Error(error);
  }
}

async function getReportFollowUpActionById({selector, attributes, options}) {
  try {

    const reportFollowUpAction = await reportFollowUpActionsModel.findOne(
      selector,
      attributes,
      options,
    );

    return reportFollowUpAction;
  } catch (error) {
    throw new Error(error);
  }
}



async function getAllReportFollowUpActions({ selector, page, limit, fields, sort }) {
  try {
    page = page & (page < 1) ? 1 : page;
    const {rows , count} = await reportFollowUpActionsModel.findAll(selector, fields, {
      offset: parseInt((page - 1) * limit),
      limit:parseInt(limit),
       sort,
    });
    return {actions: rows , count};
  } catch (error) {
    throw new Error(error);
  }
}




async function updateReportFollowUpActionById(actionId, updateFields , user) {
  try {
    const reportAction = await reportFollowUpActionsModel.findOne(
      {
        id: actionId,
        ...(user.role == reporterRole ? { userId: user.id } : {}),
      },
      ["id"]
    );

    if (!reportAction) {
      throw new Error(`No reportAction existed with this id: ${actionId}`);
    }

     await reportFollowUpActionsModel.update(
      {
        id: actionId,
      },
      {
        $set: {
            ...(_.get(updateFields, "set.state")
            ? { state: _.get(updateFields, "set.state") }
            : {}), 
            ...(_.get(updateFields, "set.deadLine")
            ? { deadLine: _.get(updateFields, "set.deadLine") }
            : {}),
        },

      },
    );

    return reportAction

  } catch (error) {
    throw new Error(error);
  }
}

async function getFollowUpActionsPercentages({
  createdFrom,
  createdTo,
  deadLineFrom,
  deadLineTo,
  byWhomId,
  departmentId,
  reportId,
}) {
  try {
    const data = await reportFollowUpActionsModel.getFollowUpActionsPercentages(
      {
        createdFrom,
        createdTo,
        deadLineFrom,
        deadLineTo,
        byWhomId,
        departmentId,
        reportId,

      }
    );
    return data;
  } catch (error) {
    throw new Error(error);
  }
}




module.exports = {
  createSingleReportFollowUpAction,
  createBulkReportFollowUpAction,
  validateReportFollowUpActions,
  deleteReportFollowUpActions,
  getReportFollowUpActionById,
  getAllReportFollowUpActions,
  updateReportFollowUpActionById,
  getFollowUpActionsPercentages,
};
