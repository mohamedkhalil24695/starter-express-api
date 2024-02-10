const { convertSortToOrder } = require("../../../common/utils");
const sequelize = require("../../../config/sequalize");
const Action = require("../../actions/schema");
const Area = require("../../areas/schema");
const Department = require("../../departments/schema");
const ReportImages = require("../../reportImages/schema");
const ReportActions = require("../../report_actions/schema");
const ReportFollowUpActions = require("../../report_followup_actions/schema");
const User = require("../../users/schema");
const Report = require("../schema");
const _ = require("lodash");
const { Op, Sequelize } = require('sequelize');

async function create(reportBody, transaction) {
  try {
    const {
      creatorId,
      assistorName,
      departmentId,
      areaId,
      NumberOfObservers,
      comment
    } = reportBody;

    const newReport = await Report.create(
      {
        creatorId,
        assistorName,
        departmentId,
        areaId,
        NumberOfObservers,
        comment
      },
      { transaction }
    );

    return newReport;
  } catch (error) {
    throw new Error(error);
  }
}

async function findOne(selector = {}, attributes = [], options, transaction) {
  return await Report.findOne({
    where: selector,
    transaction,
    ...(_.get(attributes, "length") ? { attributes } : {}),
    include: [
    {
    model: User,
    as: 'creator',
    required: false,
    attributes:["id","fullName", "email","role","phoneNumber"],
   },
   {
    model: Department,
    required: false,
    attributes:["id","name","nameAr"],
   },
   {
    model: Area,
    required: false,
    attributes:["id","name"],
   },
      ...(Object.keys(options || []).length ? [
        ...(options.joinReportActions ? [
          {
            model: ReportActions,
            required: false,
             attributes:["id", "createdAt", "updatedAt", "comment"],
            include:[
              {
                model: Action,
                required: true,
                attributes:["name", "type", "id", "nameAr"],
                order: [['type','DESC']]
              }
            ]
          },{
            model: ReportFollowUpActions,
            required: false,
             attributes:["id", "createdAt", "updatedAt", "actionName"],
            include:[
              {
                model: User,
                required: true,
                attributes:["fullName","email","role","phoneNumber", "id"],
              }
            ]
          }
        ]:[]) ,
        ...(options.joinReportImages ? [
          {
            model: ReportImages,
            required: false,
            //attributes:["id", "createdAt", "updatedAt"],
          },
        ]:[]) ,


     ] : [] )
    ]
  });
}

async function findAll(selector = {}, attributes = [], options = {}) {
  const { offset, limit, sort } = options;

  return await Report.findAndCountAll({
    where: selector,
    order: convertSortToOrder(sort) ,
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
      attributes:["name","nameAr"],
     },
     {
      model: Area,
      required: false,
      attributes:["name"],
     }],
    ...(_.get(attributes, "length") ? { attributes } : {}),
    ...(_.get(options, "limit") ? { limit } : {}),
    ...(_.get(options, "offset") ? { offset } : {}),
  });
}

async function update(selector = {}, update = {}, transaction) {
  if (Object.keys(selector).length === 0) {
    throw new Error(
      "Cannot update all documents. Please provide a specific selector."
    );
  }

  let unsetFields = _.get(update, "$unset", {});
  if (unsetFields) {
    Object.keys(unsetFields).forEach((key) => {
      unsetFields[key] = null;
    });
  }

  return await Report.update(
    {
      ...(_.get(update, "$set") ? _.get(update, "$set") : {}),
      ...unsetFields,
    },
    {
      where: selector,
      transaction
    }
  );
}

async function destroy(selector = {},transaction) {
  if (Object.keys(selector).length === 0) {
    throw new Error(
      "Cannot delete all documents. Please provide a specific selector."
    );
  }
  return Report.destroy({
    where: selector,
    transaction
  });
}


async function getDepartmentAnalytics(selector = {}) {
  try {
    
    const {createdFrom,createdTo,departmentsIds,...otherSelectors} = selector;

    const data = await Report.findAll({
      where: {
        ...otherSelectors,
        ...(departmentsIds ? {departmentId:{[Op.in]: departmentsIds}}:{}),

        [Op.and]:[
          createdFrom ? {createdAt:{ [Op.gte]: new Date(createdFrom)}}:{} ,
          createdTo ? {createdAt:{ [Op.lte]: new Date(createdTo)}}:{} , 
          ],
      },
      attributes: [
        "departmentId",
        [
          Report.sequelize.fn("COUNT", Report.sequelize.col("departmentId")),
          "reportCount",
        ], 
        [
          Report.sequelize.fn("SUM", Report.sequelize.col("NumberOfObservers")),
          "NumberOfObservers",
        ], 
      ],
      group: ["departmentId"],
      include: [
        {
          model: Department,
          required: false,
          attributes: ["name","nameAr"],
        },
      ],
      raw: true,
    });

    return _.compact(data.map(ele=>({
      departmentId: ele.departmentId,
      departmentName: _.get(ele,'Department.name',null),
      departmentNameAr: _.get(ele,'Department.nameAr',null),
      reportCount:  parseInt(_.get(ele,'reportCount',0)),
      NumberOfObservers: parseInt(_.get(ele,'NumberOfObservers',0)),
    })));

  } catch (error) {
    console.error("Error calculating departments analytics:", error);
    throw error;
  }
}



async function getReportersAnalytics(selector = {}) {
  try {
    
    const {createdFrom,createdTo, creatorsIds, ...otherSelectors} = selector;

    const data = await Report.findAll({
      where: {
        ...otherSelectors,
        ...(creatorsIds ? {creatorId:{[Op.in]: creatorsIds}}:{}),
        [Op.and]:[
          createdFrom ? {createdAt:{ [Op.gte]: new Date(createdFrom)}}:{} ,
          createdTo ? {createdAt:{ [Op.lte]: new Date(createdTo)}}:{} , 
          ],
      },
      attributes: [
        "creatorId",
        [
          Report.sequelize.fn("COUNT", Report.sequelize.col("creatorId")),
          "reportCount",
        ], 
        [
          Report.sequelize.fn("SUM", Report.sequelize.col("NumberOfObservers")),
          "NumberOfObservers",
        ], 
      ],
      group: ["creatorId"],
      include: [
        {
          model: User,
          as: 'creator',
          required: false,
          attributes:["fullName"],
        },
      ],
      raw: true,
    });

    return _.compact(data.map(ele=>({
      creatortId: ele.creatorId,
      creatorName: _.get(ele,'creator.fullName',null),
      reportCount:  parseInt(_.get(ele,'reportCount',0)),
      NumberOfObservers: parseInt(_.get(ele,'NumberOfObservers',0)),
    })));

  } catch (error) {
    console.error("Error calculating departments analytics:", error);
    throw error;
  }
}


async function getReportsDailyAnalytics(selector = {}) {
  try {
    let { createdFrom, createdTo, groupBy, ...otherSelectors } = selector;

    const getGroupByUnit = (timeUnit) => {
      switch (timeUnit) {
        case 'day':
          return Report.sequelize.fn('DATE', Report.sequelize.col('createdAt'));
        case 'week':
          // Truncate to the start of the week (Sunday)
          return Report.sequelize.fn('DATE', Report.sequelize.literal("DATE_FORMAT(createdAt, '%Y-%m-%d') - INTERVAL WEEKDAY(createdAt) DAY"));
        case 'month':
          return Report.sequelize.fn('DATE_FORMAT', Report.sequelize.col('createdAt'), '%Y-%m-01');
        case 'year':
          return Report.sequelize.fn('DATE_FORMAT', Report.sequelize.col('createdAt'), '%Y-01-01');
        default:
          return Report.sequelize.fn('DATE', Report.sequelize.col('createdAt')); // Default to day if no valid unit is provided
      }
    };

    const data = await Report.findAll({
      where: {
        [Op.and]: [
          createdFrom ? { createdAt: { [Op.gte]: new Date(createdFrom) } } : {},
          createdTo ? { createdAt: { [Op.lte]: new Date(createdTo) } } : {},
        ],
      },
      attributes: [
        [getGroupByUnit(groupBy || 'day'), 'timeUnit'], // Default to 'day' if no groupBy is provided
        [Report.sequelize.fn('COUNT', Report.sequelize.col('id')), 'totalReports'],
        [Report.sequelize.fn('SUM', Report.sequelize.col('NumberOfObservers')), 'totalPeopleObserved'],
      ],
      group: [getGroupByUnit(groupBy || 'day')],
      raw: true,
    });


    return _.compact(data.map(ele=>({
      timeUnit: ele.timeUnit,
      totalReports:  parseInt(_.get(ele,'totalReports',0)),
      totalPeopleObserved: parseInt(_.get(ele,'totalPeopleObserved',0)),
    })));


  } catch (error) {
    console.error("Error calculating departments analytics:", error);
    throw error;
  }
}




async function getAllUsersWithLessReports(numberOfReports,firstDayOfMonth , lastDayOfMonth ){

  const query = `
  SELECT
  u.id AS userId,
  u.email,
  COALESCE(r.creatorId, 0) AS creatorId,
  COALESCE(COUNT(r.id), 0) AS num_reports
FROM
  vfl_db.User u
LEFT JOIN
  vfl_db.Report r ON u.id = r.creatorId AND r.createdAt BETWEEN '${firstDayOfMonth}' AND '${lastDayOfMonth}'
GROUP BY
  u.id, u.email, r.creatorId
having   num_reports < ${numberOfReports};
`;

const result = await sequelize.query(query, {
  type: sequelize.QueryTypes.SELECT,
});
  
return result;
}


async function getThisYearReportsCount(creatorId) {
  try {
    const data = await Report.findAll({
      where: {
        creatorId , 
        [Op.and]: [
          {
            createdAt: {
              [Op.gte]: new Date(new Date().getFullYear(), 0, 1), // Start of the current year
              [Op.lte]: new Date(new Date().getFullYear(), 11, 31, 23, 59, 59), // End of the current year
            },
          },
        ],
      },
      attributes: [
        "creatorId",
        [
          Report.sequelize.fn("COUNT", Report.sequelize.col("creatorId")),
          "reportCount",
        ],
      ],
      group: ["creatorId"],
      raw: true,
    });
    
    return {
      creatortId : _.get(data, '0.creatorId' , creatorId) ,
      reportCount : _.get(data, '0.reportCount' , 0),
    }

  } catch (error) {
    console.error("Error calculating departments analytics:", error);
    throw error;
  }
}

module.exports = {
  create,
  findOne,
  findAll,
  update,
  destroy,
  getDepartmentAnalytics,
  getReportersAnalytics,
  getReportsDailyAnalytics,
  getAllUsersWithLessReports,
  getThisYearReportsCount,
};
