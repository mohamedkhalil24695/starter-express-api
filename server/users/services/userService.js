const usersModel = require("../model/index");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  jwtTokenSecretKey,
  bcryptSalt,
} = require("../../../config/envVariables");
const { Op } = require("sequelize");
const { adminRole } = require("../../../common/roles");
const _ = require("lodash");

async function createNewUser(userBody) {
  try {
    const email = userBody.email;

    const user = await usersModel.findOne(
      {
        email,
      },
      ["id"]
    );

    if (user) {
      throw new Error("This email is already existed");
    }

    const newUser = await usersModel.createUser(userBody);
    return newUser;
  } catch (error) {
    throw new Error(error);
  }
}

async function generateHashedPassword(password) {
  try {
    const hashedPassword = await bcrypt.hash(password, parseInt(bcryptSalt));
    return hashedPassword;
  } catch (error) {
    throw new Error(error);
  }
}

async function generateUserToken(userInfo, expirationTimeInSecs = 3600) {
  try {
    // Need to move secret key to secrets
    // Need to remove any sensitive data, in a better way to only project the needed fields to be in the token
    return jwt.sign(userInfo, jwtTokenSecretKey, {
      expiresIn: expirationTimeInSecs,
    }); // will expire After hour
  } catch (error) {
    throw new Error(error);
  }
}

async function authenticateUser(email, password) {
  try {
    const user = await usersModel.findOne(
      {
        email,
      },
      [
        "id",
        "email",
        "hashedPassword",
        "fullName",
        "phoneNumber",
        "role",
        "reportsTarget",
      ]
    );

    if (!user) {
      return false;
    }

    const passwordMatch = await bcrypt.compare(password, user.hashedPassword);

    if (!passwordMatch) {
      return false;
    }

    delete user.hashedPassword;
    return user;
  } catch (error) {
    throw new Error(error);
  }
}

async function validateUser({ userId, email }) {
  try {
    const user = await usersModel.findOne(
      {
        ...(userId ? { id: userId } : {}),
        ...(email ? { email } : {}),
      },
      ["id"]
    );

    if (!user) {
      return false;
    }

    return user;
  } catch (error) {
    throw new Error(error);
  }
}

async function getAllUsers({ selector, page, limit, fields, sort }) {
  try {
    page = page & (page < 1) ? 1 : page;
    const users = await usersModel.findAndCountAll(selector, fields, {
      offset: parseInt((page - 1) * limit),
      limit: parseInt(limit),
      sort,
    });
    return {
      users: users.rows,
      count: users.count,
    };
  } catch (error) {
    throw new Error(error);
  }
}

async function getUserById(id) {
  try {
    return await usersModel.findOne(
      {
        id,
      },
      ["id", "email", "fullName", "phoneNumber", "role", "reportsTarget"]
    );
  } catch (error) {
    throw new Error(error);
  }
}

async function updateUserById(requester, updateFields, userId, transaction) {
  try {
    const user = await usersModel.findOne(
      {
        id: userId,
      },
      ["id"],
      {},
      transaction
    );

    if (!user) {
      throw new Error(`No user existed with this id: ${userId}`);
    }

    if (requester.role != adminRole && user.id != requester.id) {
      throw new Error("This requester can not update this user");
    }

    await usersModel.update(
      {
        id: userId,
      },
      {
        $set: {
          ...(_.get(updateFields, "set.email")
            ? { email: _.get(updateFields, "set.email") }
            : {}),

          ...(_.get(updateFields, "set.fullName")
            ? { fullName: _.get(updateFields, "set.fullName") }
            : {}),

          ...(_.get(updateFields, "set.phoneNumber")
            ? { phoneNumber: _.get(updateFields, "set.phoneNumber") }
            : {}),

          ...(_.get(updateFields, "set.reportsTarget")
            ? { reportsTarget: _.get(updateFields, "set.reportsTarget") }
            : {}),

          ...(_.get(updateFields, "set.role")
            ? { role: _.get(updateFields, "set.role") }
            : {}),

          ...(_.get(updateFields, "set.hashedPassword")
            ? { hashedPassword: _.get(updateFields, "set.hashedPassword") }
            : {}),
        },
      },
      transaction
    );

    return user;
  } catch (error) {
    throw new Error(error);
  }
}

async function getUsersMatchesFields({ email, phoneNumber, fullName }) {
  try {
    const users = await usersModel.findAll(
      {
        [Op.or]: [
          email ? { email } : {},
          phoneNumber ? { phoneNumber } : {},
          fullName ? { fullName } : {},
        ],
      },
      ["id", "email", "fullName", "phoneNumber"]
    );

    return users;
  } catch (error) {
    throw new Error(error);
  }
}

async function deleteUserById(userId) {
  try {
    const user = await usersModel.findOne(
      {
        id: userId,
      },
      ["id"]
    );

    if (!user) {
      throw new Error(`No user existed with this id: ${userId}`);
    }
    return await usersModel.destroy({
      id: userId,
    });
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = {
  createNewUser,
  generateHashedPassword,
  authenticateUser,
  generateUserToken,
  validateUser,
  getAllUsers,
  getUserById,
  updateUserById,
  getUsersMatchesFields,
  deleteUserById,
};
