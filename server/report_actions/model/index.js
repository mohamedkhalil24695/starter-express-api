
const ReportActions = require('../schema');
const _ = require("lodash");


async function create(reportActionBody) {
  try {
    const { reportId, 
      actionId,
      userId,
    } = reportActionBody;

    const newReportAction = await ReportActions.create({reportId, 
      actionId,
      userId,  });

    return newReportAction;
  } catch (error) {
    throw new Error(error);
  }
}



async function bulkCreate(reportId, userId, actions, transaction) {
  try {
    const formattedReportActions = actions.map(action => ({
      userId, 
      actionId: action.actionId,
      reportId:reportId,
      comment:action.comment
    }));

    return await ReportActions.bulkCreate(formattedReportActions, (transaction ? { transaction } : undefined));
  } catch (error) { 
    throw new Error(error);
  }
}


async function findOne(selector={}, attributes = []){
  return await ReportActions.findOne({
    where: selector, 
    ...( _.get(attributes,'length') ? {attributes} : {}),
    raw: true
  })
}


async function findAll(selector={}, attributes = [] , options = {}){
  const {offset , limit , sort} = options ;
  return await ReportActions.findAll({
    where:selector,
    ...( _.get(attributes,'length') ? {attributes} : {}),
    ...( _.get(options,'limit') ? {limit}: {}),
    ...( _.get(options,'offset') ? {offset}: {}),
    raw: true
  })
}


async function update(selector = {}, update = {}) {
  if (Object.keys(selector).length === 0) {
    throw new Error('Cannot update all documents. Please provide a specific selector.');
  }
 
  let unsetFields = _.get(update,'$unset',{})
  if(unsetFields){
  Object.keys(unsetFields).forEach(key => {
    unsetFields[key] = null;
  }); }

  return await ReportActions.update(
    {
      ...(_.get(update,'$set') ? _.get(update,'$set') :{}),
      ...unsetFields
    } , {
    where:selector,
  })
}


async function destroy(selector = {},transaction) {
  if (Object.keys(selector).length === 0) {
    throw new Error('Cannot delete all documents. Please provide a specific selector.');
  }
  return ReportActions.destroy({
    where: selector,
    transaction
  },);
}



module.exports = {
  create,findOne,findAll,update,destroy,bulkCreate
};