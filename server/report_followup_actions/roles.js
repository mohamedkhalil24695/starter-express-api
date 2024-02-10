const { adminRole, superVisorRole , reporterRole } = require("../../common/roles");
const {
    REPORT_FUA__GET_REPORT_FOLLOW_UP_ACTION_BY_ID,
    REPORT_FUA__GET_ALL_REPORT_FOLLOW_UP_ACTIONS,
    REPORT_FUA__UPDATE_FOLLOW_UP_ACTION,
    REPORT_FUA__DONE_INPROGRESS_ANALYTICS,
} = require('./helpers/constants').endPointsConstants;

module.exports = {
    [REPORT_FUA__GET_REPORT_FOLLOW_UP_ACTION_BY_ID] :[
        adminRole,reporterRole
    ],
    [REPORT_FUA__GET_ALL_REPORT_FOLLOW_UP_ACTIONS] :[
        adminRole,reporterRole
    ],
    [REPORT_FUA__UPDATE_FOLLOW_UP_ACTION] :[
        adminRole,reporterRole
    ],
    [REPORT_FUA__DONE_INPROGRESS_ANALYTICS] :[
        adminRole
    ],
    
}

