
const Action = require('../schema');
const _ = require('lodash')


async function create(actionBody) {
  try {
    const { name, type , nameAr} = actionBody;
    const newAction = await Action.create({name, type, nameAr});
    return newAction;
  } catch (error) {
    throw new Error(error);
  }
}

async function findOne(selector={}, attributes = []){
  return await Action.findOne({
    where: selector,
    ...( _.get(attributes,'length') ? {attributes} : {}),
    raw: true
  })
}


async function findAndCountAll(selector={}, attributes = [] , options = {}){
  const {offset , limit , sort} = options ;
  return await Action.findAndCountAll({
    where:selector,
    ...( _.get(attributes,'length') ? {attributes} : {}),
    ...( _.get(options,'limit') ? {limit}: {}),
    ...( _.get(options,'offset') ? {offset}: {}),
    raw: true
  })
}

async function findAll(selector={}, attributes = [] , options = {}){
  const {offset , limit , sort} = options ;

  return await Action.findAll({
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

  return await Action.update(
    {
      ...(_.get(update,'$set') ? _.get(update,'$set') :{}),
      ...unsetFields
    } , {
    where:selector,
  })
}


async function destroy(selector = {}) {
  if (Object.keys(selector).length === 0) {
    throw new Error('Cannot delete all documents. Please provide a specific selector.');
  }
  return Action.destroy({
    where: selector
  });
}


module.exports = {
  create,findOne,findAndCountAll,update,destroy, findAll
};
