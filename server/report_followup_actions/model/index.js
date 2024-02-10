
const ReportFollowUpActions = require('../schema');
const _ = require("lodash");
const User = require("../../users/schema");
const Report = require('../../reports/schema');
const Department = require('../../departments/schema');
const Area = require('../../areas/schema');
const { Op } = require('sequelize');


async function create(reportFollowUpActionBody) {
  try {
    const { reportId, 
      actionName,
      userId,
    } = reportFollowUpActionBody;

    const newReportFollowUpAction = await ReportFollowUpActions.create({reportId, 
      actionName,
      userId,  });

    return newReportFollowUpAction;
  } catch (error) {
    throw new Error(error);
  }
}

async function bulkCreate(reportId, followUpActions, transaction) {
  try {
    const formattedReportFollowUpActions = followUpActions.map(action => ({
      reportId,
      actionName: action.actionName,
      userId: action.userId
    }));
    return await ReportFollowUpActions.bulkCreate(formattedReportFollowUpActions, (transaction ? { transaction } : undefined));
  } catch (error) { 
    throw new Error(error);
  }
}


async function findOne(selector={}, attributes = []){
  return await ReportFollowUpActions.findOne({
    where: selector,
    ...( _.get(attributes,'length') ? {attributes} : {}),
    include: [
      {
      model: User,
      required: false,
      attributes:["fullName"],
     },
    {
      model: Report,
      required: false,
      attributes:["departmentId", "areaId","creatorId","id"],
      include: [
        {
        model: User,
        as: 'creator',
        required: false,
        attributes:["fullName"],
       },
      {
        model: Department,
        required: false,
        attributes:["name", "nameAr"],
       },
      {
        model: Area,
        required: false,
        attributes:["name"],
       }
      ],
    }
    ],
  })
}


async function findAll(selector={}, attributes = [] , options = {}){
  const {offset , limit , sort} = options ;
  const {createdFrom,createdTo,deadLineFrom,deadLineTo, actionName, reportId, byWhomId,departmentId, ...otherSelectors} = selector;

  return await ReportFollowUpActions.findAndCountAll({
    where:{
      ...otherSelectors,
      ...(reportId ? {reportId}:{}) ,
      [Op.and]:[
        createdFrom ? {createdAt:{ [Op.gte]: new Date(createdFrom)}}:{} ,
        createdTo ? {createdAt:{ [Op.lte]: new Date(createdTo)}}:{} , 
        deadLineFrom ? {deadLine:{ [Op.gte]: deadLineFrom}}:{} ,
        deadLineTo ? {deadLine:{ [Op.lte]: deadLineTo}}:{} ,
        ],
        ...(actionName ? {
          actionName : 
            { [Op.like]: `%${actionName}%` }
        } : {}),
    },
    ...( _.get(attributes,'length') ? {attributes} : {}),
    ...( _.get(options,'limit') ? {limit}: {}),
    ...( _.get(options,'offset') ? {offset}: {}),
    include: [
      {
      model: User,
      required: true,
      attributes:["fullName", "id"],
      where : {
        ...(byWhomId ? {id: byWhomId}:{}),
      },
     },
    {
      model: Report,
      required: true,
      attributes:["departmentId", "areaId","creatorId","id"],
      where : {
        ...(reportId ? {id: reportId}:{}),
      },
      include: [
        {
        model: User,
        as: 'creator',
        required: false,
        attributes:["fullName"],
       },
      {
        model: Department,
        required: true,
        attributes:["name","id","nameAr"],
        where : {
          ...(departmentId ? {id: departmentId}:{}),
        },
       },
      {
        model: Area,
        required: false,
        attributes:["name"],
       }
      ],
    }
    ],
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

  return await ReportFollowUpActions.update(
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
  return ReportFollowUpActions.destroy({
    where: selector,
    transaction
  });
}

async function getFollowUpActionsPercentages(
  {
    createdFrom,
    createdTo,
    deadLineFrom,
    deadLineTo,
    byWhomId,
    departmentId,
    reportId
  }
) {

  try {
    const taskCounts = await ReportFollowUpActions.findAll({
      where : {
        [Op.and]:[
        createdFrom ? {createdAt:{ [Op.gte]: new Date(createdFrom)}}:{} ,
        createdTo ? {createdAt:{ [Op.lte]: new Date(createdTo)}}:{} , 
        deadLineFrom ? {deadLine:{ [Op.gte]: deadLineFrom}}:{} ,
        deadLineTo ? {deadLine:{ [Op.lte]: deadLineTo}}:{} ,
        ],
        ...(reportId ? {reportId}:{}) ,

      },
      attributes: [
        [ReportFollowUpActions.sequelize.fn('COUNT', ReportFollowUpActions.sequelize.col('ReportFollowUpActions.id')), 'count'],
        [ReportFollowUpActions.sequelize.literal("SUM(CASE WHEN state = 'Done' THEN 1 ELSE 0 END)"), 'doneCount'],
      ],
      include: [
        byWhomId && {
          model: User,
          required: true,
          where: {
            id: byWhomId,
          },
        },
        (reportId || departmentId) && {
          model: Report,
          required: true,
          where: {
            ...(reportId ? { id: reportId } : {}),
          },
          include: [
            departmentId && {
              model: Department,
              required: true,
              where: {
                id: departmentId,
              },
            },
          ].filter(Boolean),
          attributes: [], // Remove 'Report.id' from the attributes list
        },
      ].filter(Boolean), 
      raw: true,
    });

    const totalTasks = parseInt(_.get(taskCounts,'0.count',0));
    const doneTasks = parseInt(_.get(taskCounts,'0.doneCount',0));

    const donePercentage = (doneTasks / totalTasks) * 100;
    const inProgressPercentage = 100 - donePercentage;

    const doneRounded = Math.round(donePercentage * 100) / 100;
    const inProgressRounded = Math.round(inProgressPercentage * 100) / 100;


    return {
      done: doneRounded || 0 ,
      inProgress: inProgressRounded || 0,
      totalTasks,
      doneTasks
    };
  } catch (error) {
    console.error('Error calculating task percentage:', error);
    throw error;
  }

}





module.exports = {
  create,findOne,findAll,update,destroy,bulkCreate,getFollowUpActionsPercentages
};