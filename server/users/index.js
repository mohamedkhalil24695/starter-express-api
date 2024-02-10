const express = require('express');
const router = express.Router();
const usersController = require('./controllers/index');
const validateRequest = require('../../common/validator');
const validationSchema = require('./validations');
const authenticateUser = require('../../common/authenticator');
const authorizeUser = require('../../common/authorizer');
const { USER_LOGIN, USER_REGISTER , USER_UPDATE_USER,  USER_GET_USERS, USER_GET_USER_BY_ID, USER_DELETE_USER, USER_GET_USER_INFO, USER_CHANGE_PASSWORD} = require('./helpers/constants').endPointsConstants;

const roles = require('./roles');


router.post('/register',
authenticateUser,
authorizeUser(roles[USER_REGISTER]),
validateRequest(validationSchema[USER_REGISTER]),
usersController[USER_REGISTER]
);

router.post('/login',
validateRequest(validationSchema[USER_LOGIN]),
usersController[USER_LOGIN]
);

router.get('/userInfo',
authenticateUser,
authorizeUser(roles[USER_GET_USER_INFO]),
usersController[USER_GET_USER_INFO]
);

router.get('/',
authenticateUser,
authorizeUser(roles[USER_GET_USERS]),
validateRequest(validationSchema[USER_GET_USERS]),
usersController[USER_GET_USERS]
);


router.get('/:id',
authenticateUser,
authorizeUser(roles[USER_GET_USER_BY_ID]),
validateRequest(validationSchema[USER_GET_USER_BY_ID]),
usersController[USER_GET_USER_BY_ID]
);


router.put('/:id',
authenticateUser,
authorizeUser(roles[USER_UPDATE_USER]),
validateRequest(validationSchema[USER_UPDATE_USER]),
usersController[USER_UPDATE_USER]
);


router.delete('/:id',
authenticateUser,
authorizeUser(roles[USER_DELETE_USER]),
validateRequest(validationSchema[USER_DELETE_USER]),
usersController[USER_DELETE_USER]
);


router.post('/changePassword',
authenticateUser,
authorizeUser(roles[USER_CHANGE_PASSWORD]),
validateRequest(validationSchema[USER_CHANGE_PASSWORD]),
usersController[USER_CHANGE_PASSWORD]
);

module.exports = router;

