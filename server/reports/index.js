const express = require('express');
const router = express.Router();
const reportsController = require('./controllers/index');
const validateRequest = require('../../common/validator');
const validationSchema = require('./validations');
const authenticateUser = require('../../common/authenticator');
const authorizeUser = require('../../common/authorizer');
const {
REPORT__CREATE_REPORT,
REPORT__GET_REPORTS_BY_ID,
REPORT__GET_ALL_REPORTS,
REPORT__UPDATE_REPORT,
REPORT__DELETE_REPORT,
REPORT__GET_DEPARTMENT_ANALYTICS,
REPORT__GET_REPORTERS_ANALYTICS,
REPORT__GET_REPORTS_DAILY_ANALYTICS,
REPORT__MONTHLY_EMAIL,
REPORT__EXPORT_ALL_REPORTS,
REPORT__GET_THIS_YEAR_USER_REPORTS_COUNT
} = require('./helpers/constants').endPointsConstants;

const roles = require('./roles');


router.post('/',
authenticateUser,
authorizeUser(roles[REPORT__CREATE_REPORT]),
validateRequest(validationSchema[REPORT__CREATE_REPORT]),
reportsController[REPORT__CREATE_REPORT]
);

router.post('/monthlyReports',
reportsController[REPORT__MONTHLY_EMAIL]
);


router.post('/export',
authenticateUser,
authorizeUser(roles[REPORT__EXPORT_ALL_REPORTS]),
validateRequest(validationSchema[REPORT__EXPORT_ALL_REPORTS]),
reportsController[REPORT__EXPORT_ALL_REPORTS]
);

router.get('/:id',
authenticateUser,
authorizeUser(roles[REPORT__GET_REPORTS_BY_ID]),
validateRequest(validationSchema[REPORT__GET_REPORTS_BY_ID]),
reportsController[REPORT__GET_REPORTS_BY_ID]
);



router.get('/',
authenticateUser,
authorizeUser(roles[REPORT__GET_ALL_REPORTS]),
validateRequest(validationSchema[REPORT__GET_ALL_REPORTS]),
reportsController[REPORT__GET_ALL_REPORTS]
);



router.put('/:id',
authenticateUser,
authorizeUser(roles[REPORT__UPDATE_REPORT]),
validateRequest(validationSchema[REPORT__UPDATE_REPORT]),
reportsController[REPORT__UPDATE_REPORT]
);



router.delete('/:id',
authenticateUser,
authorizeUser(roles[REPORT__DELETE_REPORT]),
validateRequest(validationSchema[REPORT__DELETE_REPORT]),
reportsController[REPORT__DELETE_REPORT]
);


router.get('/analytics/departmentAnalytics',
authenticateUser,
authorizeUser(roles[REPORT__GET_DEPARTMENT_ANALYTICS]),
validateRequest(validationSchema[REPORT__GET_DEPARTMENT_ANALYTICS]),
reportsController[REPORT__GET_DEPARTMENT_ANALYTICS]
);


router.get('/analytics/usersAnalytics',
authenticateUser,
authorizeUser(roles[REPORT__GET_REPORTERS_ANALYTICS]),
validateRequest(validationSchema[REPORT__GET_REPORTERS_ANALYTICS]),
reportsController[REPORT__GET_REPORTERS_ANALYTICS]
);

router.get('/analytics/ReportDailyAnalytics',
authenticateUser,
authorizeUser(roles[REPORT__GET_REPORTS_DAILY_ANALYTICS]),
validateRequest(validationSchema[REPORT__GET_REPORTS_DAILY_ANALYTICS]),
reportsController[REPORT__GET_REPORTS_DAILY_ANALYTICS]
);


router.get('/analytics/userReportsCount',
authenticateUser,
authorizeUser(roles[REPORT__GET_THIS_YEAR_USER_REPORTS_COUNT]),
reportsController[REPORT__GET_THIS_YEAR_USER_REPORTS_COUNT]
);

module.exports = router;

