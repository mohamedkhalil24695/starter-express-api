const express = require('express');
const router = express.Router();
const areasController = require('./controllers/index');
const validateRequest = require('../../common/validator');
const validationSchema = require('./validations');
const authenticateUser = require('../../common/authenticator');
const authorizeUser = require('../../common/authorizer');
const {
AREA__CREATE_AREA,
AREA__GET_ALL_AREAS_NAMES,
AREA__GET_ALL_AREAS,
AREA__UPDATE_AREA,
AREA__DELETE_AREA,
} = require('./helpers/constants').endPointsConstants;

const roles = require('./roles');


router.post('/',
authenticateUser,
authorizeUser(roles[AREA__CREATE_AREA]),
validateRequest(validationSchema[AREA__CREATE_AREA]),
areasController[AREA__CREATE_AREA]
);


router.get('/',
authenticateUser,
authorizeUser(roles[AREA__GET_ALL_AREAS]),
validateRequest(validationSchema[AREA__GET_ALL_AREAS]),
areasController[AREA__GET_ALL_AREAS]
);

router.get('/names',
authenticateUser,
authorizeUser(roles[AREA__GET_ALL_AREAS_NAMES]),
validateRequest(validationSchema[AREA__GET_ALL_AREAS_NAMES]),
areasController[AREA__GET_ALL_AREAS_NAMES]
);

router.put('/:id',
authenticateUser,
authorizeUser(roles[AREA__UPDATE_AREA]),
validateRequest(validationSchema[AREA__UPDATE_AREA]),
areasController[AREA__UPDATE_AREA]
);

router.delete('/:id',
authenticateUser,
authorizeUser(roles[AREA__DELETE_AREA]),
validateRequest(validationSchema[AREA__DELETE_AREA]),
areasController[AREA__DELETE_AREA]
);



module.exports = router;

