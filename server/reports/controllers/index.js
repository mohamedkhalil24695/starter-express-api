const _ = require("lodash");
const moment = require('moment');
const reportService = require("../services/reportService");
const reportActionsService = require("../../report_actions/services/reportActionsService");
const reportFollowUpActionsService = require("../../report_followup_actions/services/reportFollowUpActionsService");
const reportImagesService = require("../../reportImages/services/reportImagesService");
const imagesService = require("../../images/services/imageService");

const { adminRole } = require("../../../common/roles");
const userService = require("../../users/services/userService");
const departmentService = require("../../departments/services/departmentService");
const areaService = require("../../areas/services/areaService");
const actionService = require("../../actions/services/actionService");
const sequelize = require("../../../config/sequalize");
const { _fakePagination } = require("../../../common/utils");
const { sendingEmail } = require("../../emailService/services");
const { exportXlsxSheets } = require("../../excelService/services");
const { allReportsXlsxSheetFormatter } = require("../helpers/utils");
const { minReportsOnMonthToSendEmail } = require("../../../config/envVariables");

const {
  REPORT__CREATE_REPORT,
  REPORT__GET_REPORTS_BY_ID,
  REPORT__GET_ALL_REPORTS,
  REPORT__UPDATE_REPORT,
  REPORT__DELETE_REPORT,
  REPORT__GET_DEPARTMENT_ANALYTICS,
  REPORT__GET_REPORTERS_ANALYTICS,
  REPORT__GET_REPORTS_DAILY_ANALYTICS,
  REPORT__MONTHLY_EMAIL,
  REPORT__EXPORT_ALL_REPORTS,
  REPORT__GET_THIS_YEAR_USER_REPORTS_COUNT,
} = require("../helpers/constants").endPointsConstants;

module.exports = {
  [REPORT__CREATE_REPORT]: async (req, res, next) => {
    const transaction = await sequelize.transaction();

    try {
      const creationBody = req.body;
      const { departmentId, actions, areaId, followUpActions, images } = req.body;
      let { assistorName } = req.body;

      const { id: creatorId } = _.get(req, "user");

      if (!creatorId) {
        throw new Error("Creator Id must be provided !");
      }

      if (!(await userService.validateUser({ userId: creatorId }))) {
        throw new Error("creatorId is not valid");
      }

      if (!(await departmentService.validateDepartment({ departmentId }))) {
        throw new Error("departmentId is not valid");
      }

      if (!(await areaService.validateArea({ areaId }))) {
        throw new Error("areaId is not valid");
      }

      if (
        _.get(actions, "length") &&
        !(await actionService.validateActions(actions))
      ) {
        throw new Error("actionIds is not valid");
      }

      if (_.get(followUpActions, "length")) {
        const followUpActionsUsers = followUpActions.map(
          (action) => action.userId
        );

        await Promise.all(
          followUpActionsUsers.map(async (userId) => {
            const isUserExisted = await userService.validateUser({
              userId: userId,
            });
            if (!isUserExisted) {
              throw new Error(
                `userId ${userId} in followUp action is not valid`
              );
            }
          })
        );
      }

      const createdReport = await reportService.createNewReport(
        creationBody,
        creatorId,
        assistorName,
        transaction
      );

      if (_.get(actions, "length")) {
        await reportActionsService.createBulkReportAction(
          createdReport.id,
          creatorId,
          actions,
          transaction
        );
      }

      if (_.get(followUpActions, "length")) {
        await reportFollowUpActionsService.createBulkReportFollowUpAction(
          createdReport.id,
          followUpActions,
          transaction
        );
      }

      if (_.get(images, "length")) {
        await reportImagesService.createBulkReportImage(
          createdReport.id,
          images,
          transaction
        );
      }

      await transaction.commit();


      if (_.get(followUpActions, "length")) {

        const userIds = followUpActions.map(action => action.userId);

        const {users:usersData} = await userService.getAllUsers({
          selector: {
            id: userIds 
          },
          fields:["email","id"]
        });

        const mergedData = followUpActions.map(action => ({
          userId: action.userId,
          actionName: action.actionName, // Replace with the actual property name for action name
          email: usersData.find(user => user.id === action.userId)?.email,
        }));
        

        for (const action of mergedData) {
          try {
            const text = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Email Example</title>
            </head>
            <body>
              <h2>Hello, there!</h2>
              <h1>You have a new action assigned!</h1>
              <p> A new action assigned to you "${action.actionName}" </p>
              <p>Best regards,</p>
              <p>ECPC</p>
            </body>
            </html>
          `;

            await sendingEmail(
              action.email,
              `VFL || You have a new action assigned to you "${action.actionName}"`,
              text
            );
          } catch (error) {
            console.error(`Error sending email to ${action.email}:`, error);
            // Handle the error as needed
          }
        }

      }


      return res.status(200).json({
        success: true,
        data: createdReport,
      });
    } catch (error) {
      await transaction.rollback();
      return res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },
  [REPORT__GET_REPORTS_BY_ID]: async (req, res, next) => {
    try {
      const { id } = req.params;
      const {role} = _.get(req, "user");

      let creatorId = null 
      // By commenting the following, any user can show the report of any other user
      /*
      if(role != adminRole){
        creatorId = _.get(req, "user.id");
      }*/


      let data = await reportService.getReportById({
        selector: {
          ...(id ? { id } : {}),
          ...(creatorId ? { creatorId } : {}),
        },
        attributes: [
          "id",
          "NumberOfObservers",
          "createdAt",
          "updatedAt",
          "assistorName",
          "comment",
        ],
        options: {
          joinReportActions: true,
          joinReportImages: true
        },
      });

      if( _.get(data, 'ReportImages.length')){
        data = JSON.parse(JSON.stringify(data));
        const formattedImages = await Promise.all(_.get(data, 'ReportImages').map(async (image) => {
          const imageResult = await imagesService.getImage(image.imageName);
          return {
            imageLink: imageResult,
            id: image.id
          };
        }));
        data.ReportImages= formattedImages
      }

      return res.status(200).json({
        success: true,
        data: data,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },

  [REPORT__GET_ALL_REPORTS]: async (req, res, next) => {
    try {
      const { page, limit, name, reportId } = req.query;
      const {role} = _.get(req, "user");

      let creatorId = null 

      if(role != adminRole){
        creatorId = _.get(req, "user.id");
      }

      const data = await reportService.getAllReports({
        selector: {
          ...(name ? { name: { $regex: new RegExp("^" + name, "i") } } : {}),
          ...(reportId ? {id: reportId} : {}),
          ...(creatorId ? {creatorId} : {}),
        },
        fields: ["id", "createdAt", "updatedAt", "assistorName"],
        ...(page ? { page } : {}),
        ...(limit ? { limit } : {}),
        sort: {
          createdAt: -1,
        },
      });
      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },




  [REPORT__EXPORT_ALL_REPORTS]: async (req, res, next) => {
    try {
      const { page, limit, name, reportId } = req.query;
      const {role} = _.get(req, "user");

      let creatorId = null 

      if(role != adminRole){
        creatorId = _.get(req, "user.id");
      }

      const data = await reportService.getAllReports({
        selector: {
          ...(name ? { name: { $regex: new RegExp("^" + name, "i") } } : {}),
          ...(reportId ? {id: reportId} : {}),
          ...(creatorId ? {creatorId} : {}),
        },
        fields: ["id", "createdAt", "updatedAt", "assistorName"],
        ...(page ? { page } : {}),
        ...(limit ? { limit } : {}),
        sort: {
          createdAt: 1,
        },
      });

      const sheetName = "Reports Sheet";
      const file = await exportXlsxSheets({
        list: allReportsXlsxSheetFormatter(data.reports),
        sheetName,
      });

      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.setHeader(
        'Content-Disposition',
        `${'attachment; filename="'}${sheetName}.xlsx"`
      );
      return res.status(200).send(file);

    } catch (error) {
      return res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },

  [REPORT__UPDATE_REPORT]: async (req, res, next) => {
    const transaction = await sequelize.transaction();

    try {
      const { set, unset, add, remove } = req.body;
      const { id } = req.params;

      const user = _.get(req, "user");

      const departmentId = _.get(set, "departmentId");
      const areaId = _.get(set, "areaId") || _.get(unset, "areaId");

      if (
        departmentId &&
        !(await departmentService.validateDepartment({ departmentId }))
      ) {
        throw new Error("departmentId is not valid");
      }

      if (areaId && !(await areaService.validateArea({ areaId }))) {
        throw new Error("areaId is not valid");
      }

      const updatedReport = await reportService.updateReportById(
        id,
        { set, unset, add, remove },
        user,
        transaction
      );

      if (_.get(add, "actions.length")) {
        if (!(await actionService.validateActions(_.get(add, "actions")))) {
          throw new Error("actionIds is not valid");
        }

        await reportActionsService.createBulkReportAction(
          updatedReport.id,
          updatedReport.creatorId,
          _.get(add, "actions"),
          transaction
        );
      }

      if (_.get(add, "followUpActions.length")) {
        const followUpActionsUsers = _.get(add, "followUpActions").map(
          (action) => action.userId
        );

        await Promise.all(
          followUpActionsUsers.map(async (userId) => {
            const isUserExisted = await userService.validateUser({
              userId: userId,
            });
            if (!isUserExisted) {
              throw new Error(
                `userId ${userId} in followUp action is not valid`
              );
            }
          })
        );

        await reportFollowUpActionsService.createBulkReportFollowUpAction(
          updatedReport.id,
          _.get(add, "followUpActions"),
          transaction
        );
      }


      if (_.get(add, "images.length")) {
        await reportImagesService.createBulkReportImage(
          updatedReport.id,
          _.get(add, "images"),
          transaction
        )
      }


      if (_.get(remove, "actions.length")) {

        // validate report actions that belongs to user
        if (
          !(await reportActionsService.validateReportActions(
            _.get(remove, "actions"),
            updatedReport.id
          ))
        ) {
          throw new Error("actionIds is not valid");
        }

        await reportActionsService.deleteReportActions(
          _.get(remove, "actions"),
          updatedReport.id,
          transaction
        );
      }

      if (_.get(remove, "followUpActions.length")) {
        if (
          !(await reportFollowUpActionsService.validateReportFollowUpActions(
            _.get(remove, "followUpActions"),
            updatedReport.id
          ))
        ) {
          throw new Error("followUpActionsIds is not valid");
        }

        await reportFollowUpActionsService.deleteReportFollowUpActions(
          _.get(remove, "followUpActions"),
          updatedReport.id,
          transaction
        );
      }

      if (_.get(remove, "images.length")) {

        if (
          !(await reportImagesService.validateReportImages(
            _.get(remove, "images"),
            updatedReport.id
          ))
        ) {
          throw new Error("imagesIds is not valid");
        }
      
        await reportImagesService.deleteReportImage(
          _.get(remove, "images"),
          updatedReport.id,
          transaction
        )
      }

      await transaction.commit();


      if (_.get(add, "followUpActions.length")) {

        const userIds = _.get(add, "followUpActions").map(action => action.userId);

        const {users:usersData} = await userService.getAllUsers({
          selector: {
            id: userIds 
          },
          fields:["email","id"]
        });

        const mergedData = _.get(add, "followUpActions").map(action => ({
          userId: action.userId,
          actionName: action.actionName, // Replace with the actual property name for action name
          email: usersData.find(user => user.id === action.userId)?.email,
        }));
        

        for (const action of mergedData) {
          try {

            const text = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Email Example</title>
            </head>
            <body>
              <h2>Hello, there!</h2>
              <h1>You have a new action assigned!</h1>
              <p> A new action assigned to you "${action.actionName}" </p>
              <p>Best regards,</p>
              <p>ECPC</p>
            </body>
            </html>
          `;


            await sendingEmail(
              action.email,
              `VFL || You have a new action assigned to you "${action.actionName}"`,
              text
            );
          } catch (error) {
            console.error(`Error sending email to ${action.email}:`, error);
            // Handle the error as needed
          }
        }

      }


      return res.status(200).json({
        success: true,
        message: "Updated Successfully",
      });
    } catch (error) {
      await transaction.rollback();
      return res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },

  [REPORT__DELETE_REPORT]: async (req, res, next) => {
    const transaction = await sequelize.transaction();

    try {
      const { id } = req.params;
      const user = _.get(req, "user");

      await reportService.deleteReportById(id, user, transaction);
      await transaction.commit();
      return res.status(200).json({
        success: true,
        message: "Deleted Successfully",
      });
    } catch (error) {
      await transaction.rollback();
      return res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },



  [REPORT__GET_DEPARTMENT_ANALYTICS]: async (req, res, next) => {
    try {
      const { createdFrom, createdTo , departmentsIds, page , limit } = req.query;
     const data = await reportService.getDepartmentAnalytics({
      createdFrom, createdTo ,  departmentsIds: departmentsIds ? departmentsIds.split(","): undefined
     });
      return res.status(200).json({
        success: true,
        data: {
          paginatedData: _fakePagination(data,  page , limit),
          analyticsData: data
        },
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },



  [REPORT__GET_REPORTERS_ANALYTICS]: async (req, res, next) => {
    try {
      const { createdFrom, createdTo,creatorsIds , page , limit} = req.query;
     const data = await reportService.getReportersAnalytics({
      createdFrom, createdTo, creatorsIds: creatorsIds?creatorsIds.split(","): undefined
     });


      return res.status(200).json({
        success: true,
        data: {
          paginatedData: _fakePagination(data, page , limit),
          analyticsData: data
        },
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },

  [REPORT__GET_REPORTS_DAILY_ANALYTICS]: async (req, res, next) => {
    try {
      const { createdFrom, createdTo, groupBy, page , limit} = req.query;
     const data = await reportService.getReportsDailyAnalytics({
      createdFrom, createdTo,groupBy
     });


      return res.status(200).json({
        success: true,
        data: {
          paginatedData: _fakePagination(data, page , limit),
          analyticsData: data
        },
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },

  [REPORT__GET_THIS_YEAR_USER_REPORTS_COUNT]: async (req, res, next) => {
    try {
    const userId = _.get(req, "user.id");

     const data = await reportService.getThisYearReportsCount(userId);
      return res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },

  [REPORT__MONTHLY_EMAIL]: async (req, res, next) => {
    try {

      const firstDayOfMonth = moment().startOf('month').format('YYYY-MM-DD');
      const lastDayOfMonth = moment().endOf('month').format('YYYY-MM-DD');  
      const users = await reportService.getAllUsersWithLessReports(minReportsOnMonthToSendEmail , firstDayOfMonth , lastDayOfMonth);
      for (const user of users) {
        try {
          const text = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Email Example</title>
          </head>
          <body>
            <h2>Hello, there!</h2>
            <h1>Few number of reports email!</h1>
            <p>We noticed that you did only ${user.num_reports}.</p>
            <p>Best regards,</p>
            <p>ECPC</p>
          </body>
          </html>
        `;
          await sendingEmail(user.email , "small number of reports" ,text )
        } catch (error) {
          console.error(`Error sending email to ${user.email}:`, error);
          // Handle the error as needed
        }
      }

      return res.status(200).json({
        success: true,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },

  
  
};
