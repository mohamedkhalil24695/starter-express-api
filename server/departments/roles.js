const { adminRole, superVisorRole , reporterRole } = require("../../common/roles");
const {
DEPARTMENT__CREATE_DEPARTMENT,
DEPARTMENT__GET_ALL_DEPARTMENTS_NAMES,
DEPARTMENT__GET_ALL_DEPARTMENTS,
DEPARTMENT__UPDATE_DEPARTMENT,
DEPARTMENT__DELETE_DEPARTMENT

} = require('./helpers/constants').endPointsConstants;

module.exports = {
    [DEPARTMENT__CREATE_DEPARTMENT] :[
        adminRole
    ],
    [DEPARTMENT__GET_ALL_DEPARTMENTS_NAMES] :[
        adminRole, superVisorRole , reporterRole
    ],
    [DEPARTMENT__GET_ALL_DEPARTMENTS] :[
        adminRole, reporterRole
    ],
    [DEPARTMENT__UPDATE_DEPARTMENT] :[
        adminRole
    ],
    [DEPARTMENT__DELETE_DEPARTMENT] :[
        adminRole
    ],
}

