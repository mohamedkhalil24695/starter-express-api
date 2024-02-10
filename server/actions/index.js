const express = require('express');
const router = express.Router();
const actionsController = require('./controllers/index');
const validateRequest = require('../../common/validator');
const validationSchema = require('./validations');
const authenticateUser = require('../../common/authenticator');
const authorizeUser = require('../../common/authorizer');
const {ACTION__CREATE_ACTION, ACTION__GET_ALL_ACTIONS_NAMES , ACTION__GET_ALL_ACTIONS, ACTION__DELETE_ACTION
, ACTION__UPDATE_ACTION} = require('./helpers/constants').endPointsConstants;

const roles = require('./roles');

router.post('/',
authenticateUser,
authorizeUser(roles[ACTION__CREATE_ACTION]),
validateRequest(validationSchema[ACTION__CREATE_ACTION]),
actionsController[ACTION__CREATE_ACTION]
);

router.get('/names',
authenticateUser,
authorizeUser(roles[ACTION__GET_ALL_ACTIONS_NAMES]),
validateRequest(validationSchema[ACTION__GET_ALL_ACTIONS_NAMES]),
actionsController[ACTION__GET_ALL_ACTIONS_NAMES]
);


router.get('/',
authenticateUser,
authorizeUser(roles[ACTION__GET_ALL_ACTIONS]),
validateRequest(validationSchema[ACTION__GET_ALL_ACTIONS]),
actionsController[ACTION__GET_ALL_ACTIONS]
);


router.put('/:id',
authenticateUser,
authorizeUser(roles[ACTION__UPDATE_ACTION]),
validateRequest(validationSchema[ACTION__UPDATE_ACTION]),
actionsController[ACTION__UPDATE_ACTION]
);

router.delete('/:id',
authenticateUser,
authorizeUser(roles[ACTION__DELETE_ACTION]),
validateRequest(validationSchema[ACTION__DELETE_ACTION]),
actionsController[ACTION__DELETE_ACTION]
);


module.exports = router;

