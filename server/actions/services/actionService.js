const actionsModel = require("../model/index");
const _ = require("lodash");

async function createNewAction(actionBody) {
  try {
    const {
      name,
      type,
      nameAr,
    } = actionBody ;

    const action = await actionsModel.findOne(
      {
        name,
        type,
        nameAr
      },
      ['id']
    );

    if (action) {
      throw new Error("This action is already existed");
    }

    const newAction = await actionsModel.create({
      name,
      nameAr,
      type
    });
    return newAction;
  } catch (error) {
    throw new Error(error);
  }
}

async function getAllActions({selector, page, limit, fields, sort }) {
  try {

    page = (page & page < 1) ? 1 : page
    const actions = await actionsModel.findAndCountAll(selector,fields,
      {
        offset: parseInt((page - 1) * limit),
        limit:parseInt(limit),
         sort,
    });
    return {
      actions: actions.rows,
      count: actions.count
    };
  } catch (error) {
    throw new Error(error);
  }
}

async function updateActionById(actionId, setFields, unsetFields) {
  try {
    const action = await actionsModel.findOne(
      {
        id: actionId,
      },
      ['id'],
    );

    if (!action) {
      throw new Error(`No action existed with this id: ${actionId}`);
    }

    return await actionsModel.update(
      {
        id: actionId,
      },
      {
        $set: {
          ...(_.get(setFields, "name")
            ? { name: _.get(setFields, "name") }
            : {}),

            ...(_.get(setFields, "nameAr")
            ? { nameAr: _.get(setFields, "nameAr") }
            : {}),

            ...(_.get(setFields, "type")
            ? { type: _.get(setFields, "type") }
            : {}),
        }
      }
    );

  } catch (error) {
    throw new Error(error);
  }
}


async function deleteActionById(actionId) {
  try {
    const action = await actionsModel.findOne(
      {
        id: actionId,
      },
      ['id'],
    );

    if (!action) {
      throw new Error(`No action existed with this id: ${actionId}`);
    }
    return await actionsModel.destroy({
      id: actionId
    })
  } catch (error) {
    throw new Error(error);
  }
}


async function validateActions(actions) {
  try {

    const actionsIds = actions.map(action=>action.actionId);
    const existedActions = await actionsModel.findAll(
      {
        id: actionsIds
      },
      ['id'],
    );
    if (!existedActions) {
      return false;
    }

    const existedActionsIds = existedActions.map(action=>action.id);

    if(actionsIds.length != existedActionsIds.length ){
      return false;
    }

    return existedActions;
  } catch (error) {
    throw  new Error(error);
  }
}

module.exports = {
  createNewAction,
  getAllActions,
  updateActionById,
  deleteActionById,
  validateActions,
};
