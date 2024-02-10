// File: userModel.js

const User = require("../schema");
const _ = require('lodash');


// Function to create a new user
async function createUser(userBody) {
  try {
    const {email , fullName , phoneNumber,  hashedPassword , role , reportsTarget} = userBody;
 
   const newUser = await User.create({
      email , fullName , phoneNumber,  hashedPassword, role , reportsTarget});

    return newUser;
  } catch (error) {
    throw new Error(error);
  }
}

async function findOne(selector={}, attributes = []){
  return await User.findOne({
    where:selector,
    ...( _.get(attributes,'length') ? {attributes} : {}),
    raw: true
  })
}

async function findAndCountAll(selector={}, attributes = [] , options = {}){
    const {offset , limit , fields , sort} = options ;

    return await User.findAndCountAll({
      where:selector,
      ...( _.get(fields,'length') ? {fields} : {}),
      ...( _.get(attributes,'length') ? {attributes} : {}),
      ...( _.get(options,'limit') ? {limit}: {}),
      ...( _.get(options,'offset') ? {offset}: {}),
      raw: true
    })
}


async function findAll(selector={}, attributes = [] , options = {}){
  const {offset , limit , sort} = options ;
  return await User.findAll({
    where:selector,
    ...( _.get(attributes,'length') ? {attributes} : {}),
    ...( _.get(options,'limit') ? {limit}: {}),
    ...( _.get(options,'offset') ? {offset}: {}),
    raw: true
  })
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

  return await User.update(
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


async function destroy(selector = {}) {
  if (Object.keys(selector).length === 0) {
    throw new Error('Cannot delete all documents. Please provide a specific selector.');
  }
  return User.destroy({
    where: selector
  });
}

module.exports = {
  createUser,findOne,findAndCountAll, findAll, update, destroy
};
