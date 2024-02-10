const express = require('express');
const router = express.Router();
const reportsController = require('./controllers/index');
const validateRequest = require('../../common/validator');
const validationSchema = require('./validations');
const authenticateUser = require('../../common/authenticator');
const authorizeUser = require('../../common/authorizer');
const {
    REPORT_FUA__GET_REPORT_FOLLOW_UP_ACTION_BY_ID,
    REPORT_FUA__GET_ALL_REPORT_FOLLOW_UP_ACTIONS,
    REPORT_FUA__UPDATE_FOLLOW_UP_ACTION,
    REPORT_FUA__DONE_INPROGRESS_ANALYTICS,
} = require('./helpers/constants').endPointsConstants;

const roles = require('./roles');





router.get('/:id',
authenticateUser,
authorizeUser(roles[REPORT_FUA__GET_REPORT_FOLLOW_UP_ACTION_BY_ID]),
validateRequest(validationSchema[REPORT_FUA__GET_REPORT_FOLLOW_UP_ACTION_BY_ID]),
reportsController[REPORT_FUA__GET_REPORT_FOLLOW_UP_ACTION_BY_ID]
);



router.get('/',
authenticateUser,
authorizeUser(roles[REPORT_FUA__GET_ALL_REPORT_FOLLOW_UP_ACTIONS]),
validateRequest(validationSchema[REPORT_FUA__GET_ALL_REPORT_FOLLOW_UP_ACTIONS]),
reportsController[REPORT_FUA__GET_ALL_REPORT_FOLLOW_UP_ACTIONS]
);



router.put('/:id',
authenticateUser,
authorizeUser(roles[REPORT_FUA__UPDATE_FOLLOW_UP_ACTION]),
validateRequest(validationSchema[REPORT_FUA__UPDATE_FOLLOW_UP_ACTION]),
reportsController[REPORT_FUA__UPDATE_FOLLOW_UP_ACTION]
);

router.get('/analytics/donePercentage',
authenticateUser,
authorizeUser(roles[REPORT_FUA__DONE_INPROGRESS_ANALYTICS]),
validateRequest(validationSchema[REPORT_FUA__DONE_INPROGRESS_ANALYTICS]),
reportsController[REPORT_FUA__DONE_INPROGRESS_ANALYTICS]
);


module.exports = router;

