const _ = require("lodash");
const reportFollowUpActionsService = require("../../report_followup_actions/services/reportFollowUpActionsService");

const { adminRole } = require("../../../common/roles");
const { updateableFieldsByRole, updateableFieldsByOwnerOnly } = require("../helpers/constants");

const {
  REPORT_FUA__GET_REPORT_FOLLOW_UP_ACTION_BY_ID,
  REPORT_FUA__GET_ALL_REPORT_FOLLOW_UP_ACTIONS,
  REPORT_FUA__UPDATE_FOLLOW_UP_ACTION,
  REPORT_FUA__DONE_INPROGRESS_ANALYTICS,
} = require("../helpers/constants").endPointsConstants;

module.exports = {
  [REPORT_FUA__GET_REPORT_FOLLOW_UP_ACTION_BY_ID]: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { role } = _.get(req, "user");

      let userId = null;

      if (role != adminRole) {
        userId = _.get(req, "user.id");
      }

      const data =
        await reportFollowUpActionsService.getReportFollowUpActionById({
          selector: {
            id,
            ...(userId ? { userId } : {}),
          },
          attributes: [
            "id",
            "reportId",
            "actionName",
            "userId",
            "createdAt",
            "updatedAt",
            "state",
            "deadLine",
          ],
        });

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

  [REPORT_FUA__GET_ALL_REPORT_FOLLOW_UP_ACTIONS]: async (req, res, next) => {
    try {
      const { page, limit, actionName, referenceId, createdFrom,createdTo, deadLineFrom, deadLineTo , reportId, byWhomId,departmentId, state } = req.query;
      const { role } = _.get(req, "user");

      let userId = null;

      if (role != adminRole) {
        userId = _.get(req, "user.id");
      }

      const data =
        await reportFollowUpActionsService.getAllReportFollowUpActions({
          selector: {
            ...(referenceId ? { id: referenceId } : {}),
            ...(userId ? { userId } : {}),
            ...(createdFrom ? { createdFrom } : {}),
            ...(createdTo ? { createdTo } : {}),
            ...(deadLineFrom ? { deadLineFrom } : {}),
            ...(deadLineTo ? { deadLineTo } : {}),
            ...(actionName ? { actionName } : {}),
            ...(reportId ? { reportId } : {}),
            ...(byWhomId ? { byWhomId } : {}),
            ...(departmentId ? { departmentId } : {}),
            ...(state ? { state } : {}),
          },
          fields: [
            "id",
            "reportId",
            "actionName",
            "userId",
            "createdAt",
            "updatedAt",
            "state",
            "deadLine",
          ],
          ...(page ? { page } : {}),
          ...(limit ? { limit } : {}),
          sort: {
            createdAt: 1,
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

  [REPORT_FUA__UPDATE_FOLLOW_UP_ACTION]: async (req, res, next) => {
    try {
      const { set } = req.body;
      const { id } = req.params;

      const user = _.get(req, "user");

      const reportAction =
        await reportFollowUpActionsService.getReportFollowUpActionById({
          selector: {
            id,
          },
          attributes: ["id", "userId"],
        });

      if (user.role != adminRole && user.id != reportAction.userId) {
        throw new Error(`Only Admin or the action owner can update the action`);
      }

      Object.keys(set).forEach((field) => {
        if (
          !updateableFieldsByRole[field] ||
          !updateableFieldsByRole[field].includes(user.role)
        ) {
          throw new Error(`User with role ${user.role} cannot update ${field}`);
        } else if (
          updateableFieldsByOwnerOnly.includes(field) &&
          user.id != reportAction.userId
        ) {
          throw new Error(`deadLine can be updated by owner only `);
        }
      });

      await reportFollowUpActionsService.updateReportFollowUpActionById(
        id,
        { set },
        user
      );

      return res.status(200).json({
        success: true,
        message: "Updated Successfully",
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },

  [REPORT_FUA__DONE_INPROGRESS_ANALYTICS]: async (req, res, next) => {
    try {
      const { createdFrom, createdTo, deadLineFrom, deadLineTo } = req.query;
      const { byWhomId,departmentId, reportId} = req.query;

      const data =
        await reportFollowUpActionsService.getFollowUpActionsPercentages({
          createdFrom,
          createdTo,
          deadLineFrom,
          deadLineTo,
          byWhomId,
          departmentId,
          reportId
        });

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
};
