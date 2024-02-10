const { adminRole, reporterRole } = require("../../../common/roles")

const endPointsConstants = {
REPORT_FUA__GET_REPORT_FOLLOW_UP_ACTION_BY_ID:'REPORT_FUA__GET_REPORT_FOLLOW_UP_ACTION_BY_ID',
REPORT_FUA__GET_ALL_REPORT_FOLLOW_UP_ACTIONS:'REPORT_FUA__GET_ALL_REPORT_FOLLOW_UP_ACTIONS',
REPORT_FUA__UPDATE_FOLLOW_UP_ACTION: 'REPORT_FUA__UPDATE_FOLLOW_UP_ACTION',
REPORT_FUA__DONE_INPROGRESS_ANALYTICS: 'REPORT_FUA__DONE_INPROGRESS_ANALYTICS',

}


const updateableFieldsByRole = {
    state: [adminRole],
    deadLine: [reporterRole, adminRole]
}

const updateableFieldsByOwnerOnly = ['deadLine']

module.exports = {
    endPointsConstants,
    updateableFieldsByRole,
    updateableFieldsByOwnerOnly
}