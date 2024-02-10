const {
  tokenExpirationDurationInHours,
} = require("../../../config/envVariables");
const { numberOfSecondsPerHour } = require("../helpers/constants");
const userService = require("../services/userService");
const {
  USER_LOGIN,
  USER_REGISTER,
  USER_GET_USERS,
  USER_UPDATE_USER,
  USER_GET_USER_BY_ID,
  USER_DELETE_USER,
  USER_GET_USER_INFO,
  USER_CHANGE_PASSWORD,
} = require("../helpers/constants").endPointsConstants;
const sequelize = require("../../../config/sequalize");
const _ = require("lodash");
const { adminRole, reporterRole } = require("../../../common/roles");

module.exports = {
  [USER_REGISTER]: async (req, res, next) => {
    try {
      const creationBody = req.body;
      const password = req.body.password;
      const hashedPassword = await userService.generateHashedPassword(password);
      const result = await userService.createNewUser({
        ...creationBody,
        hashedPassword,
      });
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },

  [USER_LOGIN]: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const authenticatedUser = await userService.authenticateUser(
        email,
        password
      );

      if (!authenticatedUser) {
        return res.status(401).json({ error: "Invalid username or password." });
      }

      const token = await userService.generateUserToken(
        authenticatedUser,
        numberOfSecondsPerHour * tokenExpirationDurationInHours
      );

      return res.status(200).json({
        success: true,
        data: {
          token,
          ...authenticatedUser,
        },
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },
  [USER_GET_USERS]: async (req, res, next) => {
    try {
      const { page, limit, name,  } = req.query;
      let {  role } = req.query;

      const requesterRole = _.get(req, "user.role");

      if(requesterRole != adminRole){
        role = reporterRole;
      }

      const result = await userService.getAllUsers({
        selector:{
         // ... (name ? { name} : {}),
          ...(role ? {role}:{})
        },
        ...(page ? { page } : {}),
        ...(limit ? { limit } : {}),
        fields: ["id", "fullName", "phoneNumber", "email", "role","reportsTarget"],
        sort: {
          createdAt: 1,
        },
      });
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },

  [USER_UPDATE_USER]: async (req, res, next) => {
    const transaction = await sequelize.transaction();

    try {
      const { set } = req.body;
      const { id } = req.params;

      const user = _.get(req, "user");

      if (_.get(set, "role") && _.get(user,'role') != adminRole ) {
        throw new Error(`Only Admins can change roles of users`);
      }

      if (_.get(set, "password")) {
        const hashedPassword = await userService.generateHashedPassword(
          password
        );
        set.hashedPassword = hashedPassword;
        delete set.password;
      }

      if (
        _.get(set, "email") ||
        _.get(set, "phoneNumber") ||
        _.get(set, "fullName")
      ) {
        const existedUsers = await userService.getUsersMatchesFields({
          email: _.get(set, "email"),
          phoneNumber: _.get(set, "phoneNumber"),
          fullName: _.get(set, "fullName"),
        });

        if (_.get(existedUsers, "length")) {
          const propertiesToCheck = ["email", "phoneNumber", "fullName"];

          const existedFields = [];

          existedUsers.forEach((user) => {
            propertiesToCheck.forEach((property) => {
              if (_.get(user, property) == _.get(set, property)) {
                existedFields.push({
                  [property]: _.get(user, property),
                });
              }
            });
          });

          throw new Error(
            `Those fields already existed ${JSON.stringify(existedFields)}`
          );
        }
      }

  
        await userService.updateUserById(user, { set }, id, transaction);
      await transaction.commit();

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
  [USER_GET_USER_BY_ID]: async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await userService.getUserById(id);

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },

  [USER_DELETE_USER]: async (req, res, next) => {
    try {

      const { id } = req.params;
      const result = await userService.deleteUserById(id)

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },

  [USER_GET_USER_INFO]: async (req, res, next) => {
    try {

      const userId = _.get(req, "user.id");

      const user = await userService.getUserById(userId);

      return res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },


  [USER_CHANGE_PASSWORD]:  async (req, res, next) => {
    try {
      const transaction = await sequelize.transaction();

      const user = _.get(req, "user");
      const oldPassword = _.get(req, "body.oldPassword");
      const newPassword = _.get(req, "body.newPassword");
      const requesterEmail = _.get(req, "user.email");
      const userId = _.get(req, "user.id");

      const isUserAuthenticated = await userService.authenticateUser(
        requesterEmail,
        oldPassword
      );

      if (!isUserAuthenticated) {
        return res.status(400).json({ error: "Invalid old password." });
      }


      if (oldPassword == newPassword) {
        return res.status(400).json({ error: "New password must be a diffrent one" });
      }

      const newHashedPassword = await userService.generateHashedPassword(newPassword);

      await userService.updateUserById(user, { set:{
        hashedPassword : newHashedPassword
      } }, userId, transaction);

      await transaction.commit();

      return res.status(200).json({
        success: true,
      });
    } catch (error) {
      await transaction.rollback();

      return res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },

};
