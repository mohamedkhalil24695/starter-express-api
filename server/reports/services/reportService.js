const reportsModel = require("../model/index");
const reportActionsModel = require("../../report_actions/model/index");
const reportFollowUpActionsModel = require("../../report_followup_actions/model/index");

const _ = require("lodash");
const { adminRole } = require("../../../common/roles");

async function createNewReport(reportBody , creatorId,assistorName, transaction) {
  try {
    const {
      departmentId,
      areaId,
      NumberOfObservers,
      comment
    } = reportBody


    const newReport = await reportsModel.create({ creatorId,
      departmentId,
      areaId,
      assistorName,
      NumberOfObservers,
      comment
    }, transaction);
    return newReport;
  } catch (error) {
    throw new Error(error);
  }
}

async function getReportById({selector, attributes, options}) {
  try {

    const report = await reportsModel.findOne(
      selector,
      attributes,
      options,
    );

    return report;
  } catch (error) {
    throw new Error(error);
  }
}



async function getAllReports({ selector, page, limit, fields, sort }) {
  try {
    page = page & (page < 1) ? 1 : page;
    const {rows , count} = await reportsModel.findAll(selector, fields, {
      offset: parseInt((page - 1) * limit),
      limit:parseInt(limit),
       sort,
    });
    return {reports: rows , count};
  } catch (error) {
    throw new Error(error);
  }
}

async function updateReportById(reportId, updateFields , user,transaction) {
  try {
    const report = await reportsModel.findOne(
      {
        id: reportId,
      },
      ['id','creatorId'],{},
      transaction
    );

    if (!report) {
      throw new Error(`No report existed with this id: ${reportId}`);
    }

    if(user.role != adminRole && report.creatorId != user.id  ) {
      throw new Error("Only creator of report / Admin can update this report");
    }

     await reportsModel.update(
      {
        id: reportId,
      },
      {
        $set: {
            ...(_.get(updateFields, "set.assistorName")
            ? { assistorName: _.get(updateFields, "set.assistorName") }
            : {}),
         
            ...(_.get(updateFields, "set.departmentId")
            ? { departmentId: _.get(updateFields, "set.departmentId") }
            : {}),

            ...(_.get(updateFields, "set.areaId")
            ? { areaId: _.get(updateFields, "set.areaId") }
            : {}),  

            ...(_.get(updateFields, "set.NumberOfObservers")
            ? { NumberOfObservers: _.get(updateFields, "set.NumberOfObservers") }
            : {}), 
            ...(_.get(updateFields, "set.comment")
            ? { comment: _.get(updateFields, "set.comment") }
            : {}), 
        },

        $unset: {
          ...(_.get(updateFields, "unset.assistorName")
          ? { assistorName: 1 }
          : {}),
          ...(_.get(updateFields, "unset.NumberOfObservers")
          ? { NumberOfObservers: 1 }
          : {}),

          ...(_.get(updateFields, "unset.comment")
          ? { comment: 1 }
          : {}),
          
      },
      },
      transaction
    );

    return report

  } catch (error) {
    throw new Error(error);
  }
}


async function deleteReportById(reportId, user, transaction) {
  try {
    const report = await reportsModel.findOne(
      {
        id: reportId,
      },
      ['id' , 'creatorId'],
      {},
      transaction,
    );
    if (!report) {
      throw new Error(`No report existed with this id: ${reportId}`);
    }

    if(user.role != adminRole && report.creatorId != user.id  ) {
      throw new Error("Only creator of report / Admin can delete this report");
    }

     await reportsModel.destroy({
      id: reportId,
    },transaction);

    await reportActionsModel.destroy({
        reportId:reportId
    },transaction);

    await reportFollowUpActionsModel.destroy({
      reportId:reportId
  },transaction)

  } catch (error) {
    throw new Error(error);
  }
}


async function getDepartmentAnalytics(selector = {}) {
  try {
    const data = await reportsModel.getDepartmentAnalytics(selector);
    return data;
  } catch (error) {
    throw new Error(error);
  }
}

async function getReportersAnalytics(selector = {}) {
  try {
    const data = await reportsModel.getReportersAnalytics(selector);
    return data;
  } catch (error) {
    throw new Error(error);
  }
}

async function getReportsDailyAnalytics(selector = {}) {
  try {
    const data = await reportsModel.getReportsDailyAnalytics(selector);
    return data;
  } catch (error) {
    throw new Error(error);
  }
}



async function getAllUsersWithLessReports(numberOfReports, firstDayOfMonth , lastDayOfMonth) {
  try {
    return await reportsModel.getAllUsersWithLessReports(numberOfReports, firstDayOfMonth , lastDayOfMonth)
  } catch (error) {
    throw new Error(error);
  }
}

async function getThisYearReportsCount(creatorId) {
  try {
    return await reportsModel.getThisYearReportsCount(creatorId)
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = {
  createNewReport,
  getReportById,
  getAllReports,
  updateReportById,
  deleteReportById,
  getDepartmentAnalytics,
  getReportersAnalytics,
  getReportsDailyAnalytics,
  getAllUsersWithLessReports,
  getThisYearReportsCount,
};
