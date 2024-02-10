const express = require('express');
const router = express.Router();
const departmentsController = require('./controllers/index');
const validateRequest = require('../../common/validator');
const validationSchema = require('./validations');
const authenticateUser = require('../../common/authenticator');
const authorizeUser = require('../../common/authorizer');
const {
DEPARTMENT__CREATE_DEPARTMENT,
DEPARTMENT__GET_ALL_DEPARTMENTS_NAMES,
DEPARTMENT__GET_ALL_DEPARTMENTS,
DEPARTMENT__UPDATE_DEPARTMENT,
DEPARTMENT__DELETE_DEPARTMENT,
} = require('./helpers/constants').endPointsConstants;

const roles = require('./roles');


router.post('/',
authenticateUser,
authorizeUser(roles[DEPARTMENT__CREATE_DEPARTMENT]),
validateRequest(validationSchema[DEPARTMENT__CREATE_DEPARTMENT]),
departmentsController[DEPARTMENT__CREATE_DEPARTMENT]
);


router.get('/',
authenticateUser,
authorizeUser(roles[DEPARTMENT__GET_ALL_DEPARTMENTS]),
validateRequest(validationSchema[DEPARTMENT__GET_ALL_DEPARTMENTS]),
departmentsController[DEPARTMENT__GET_ALL_DEPARTMENTS]
);

router.get('/names',
authenticateUser,
authorizeUser(roles[DEPARTMENT__GET_ALL_DEPARTMENTS_NAMES]),
validateRequest(validationSchema[DEPARTMENT__GET_ALL_DEPARTMENTS_NAMES]),
departmentsController[DEPARTMENT__GET_ALL_DEPARTMENTS_NAMES]
);

router.put('/:id',
authenticateUser,
authorizeUser(roles[DEPARTMENT__UPDATE_DEPARTMENT]),
validateRequest(validationSchema[DEPARTMENT__UPDATE_DEPARTMENT]),
departmentsController[DEPARTMENT__UPDATE_DEPARTMENT]
);

router.delete('/:id',
authenticateUser,
authorizeUser(roles[DEPARTMENT__DELETE_DEPARTMENT]),
validateRequest(validationSchema[DEPARTMENT__DELETE_DEPARTMENT]),
departmentsController[DEPARTMENT__DELETE_DEPARTMENT]
);



module.exports = router;

