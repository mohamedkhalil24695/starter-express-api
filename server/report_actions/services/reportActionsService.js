const reportActionsModel = require("../model/index");
const _ = require("lodash");

async function createSingleReportAction(reportId, userId, actionId) {
  try {

    const newReportAction = await reportActionsModel.create({reportId, 
      actionId,
      userId,
    });
    return newReportAction;
  } catch (error) {
    throw new Error(error);
  }
}


async function createBulkReportAction(reportId, userId, actions, transaction) {
  try {
   
    const newReportAction = await reportActionsModel.bulkCreate(reportId, userId, actions, transaction)
    return newReportAction;
  } catch (error) {
    throw new Error(error);
  }
}


async function validateReportActions(actionsIds, reportId) {
  try {

    const actions = await reportActionsModel.findAll(
      {
        id: actionsIds,
        reportId: reportId 
      },
      ['id'],
    );

    if (!actions) {
      return false;
    }

    const existedActionsIds = actions.map(action=>action.id);

    if(actionsIds.length != existedActionsIds.length ){
      return false;
    }

    return actions;
  } catch (error) {
    throw  new Error(error);
  }
}


async function deleteReportActions(actionsIds , reportId, transaction) {
  try {
   
    await reportActionsModel.destroy({
      id: actionsIds,
      reportId
    }, transaction)
  } catch (error) {
    throw new Error(error);
  }
}


module.exports = {
  createSingleReportAction,
  createBulkReportAction,
  validateReportActions,
  deleteReportActions,
};
