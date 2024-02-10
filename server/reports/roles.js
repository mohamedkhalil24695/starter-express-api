const { adminRole, superVisorRole , reporterRole } = require("../../common/roles");
const {
REPORT__CREATE_REPORT,
REPORT__GET_REPORTS_BY_ID,
REPORT__GET_ALL_REPORTS,
REPORT__UPDATE_REPORT,
REPORT__DELETE_REPORT,
REPORT__GET_DEPARTMENT_ANALYTICS,
REPORT__GET_REPORTERS_ANALYTICS,
REPORT__GET_REPORTS_DAILY_ANALYTICS,
REPORT__EXPORT_ALL_REPORTS,
REPORT__GET_THIS_YEAR_USER_REPORTS_COUNT,
} = require('./helpers/constants').endPointsConstants;

module.exports = {
    [REPORT__CREATE_REPORT] :[
        adminRole,reporterRole
    ],
    [REPORT__GET_REPORTS_BY_ID] :[
        adminRole,reporterRole
    ],
    [REPORT__GET_ALL_REPORTS] :[
        adminRole, reporterRole
    ],
    [REPORT__UPDATE_REPORT] :[
        adminRole, reporterRole
    ],
    [REPORT__DELETE_REPORT] :[
        adminRole,reporterRole
    ],

    [REPORT__GET_DEPARTMENT_ANALYTICS] :[
        adminRole,reporterRole
    ],

    [REPORT__GET_REPORTERS_ANALYTICS] :[
        adminRole,reporterRole
    ],
    
    [REPORT__GET_REPORTS_DAILY_ANALYTICS]:[
        adminRole,reporterRole
    ],

    [REPORT__EXPORT_ALL_REPORTS] :[
        adminRole, reporterRole
    ],
    [REPORT__GET_THIS_YEAR_USER_REPORTS_COUNT] :[
        adminRole, reporterRole
    ],
    
}

