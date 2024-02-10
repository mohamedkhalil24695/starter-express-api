const { adminRole, superVisorRole , reporterRole } = require("../../common/roles");
const { ACTION__CREATE_ACTION, ACTION__GET_ALL_ACTIONS_NAMES, ACTION__GET_ALL_ACTIONS, ACTION__UPDATE_ACTION,ACTION__DELETE_ACTION } = require('./helpers/constants').endPointsConstants;

module.exports = {
    [ACTION__CREATE_ACTION] :[
        adminRole
    ],
    [ACTION__GET_ALL_ACTIONS_NAMES] :[
        adminRole, superVisorRole , reporterRole
    ],
    [ACTION__GET_ALL_ACTIONS] :[
        adminRole, superVisorRole , reporterRole
    ],

    [ACTION__UPDATE_ACTION] :[
        adminRole
    ],
    [ACTION__DELETE_ACTION] :[
        adminRole
    ],
}