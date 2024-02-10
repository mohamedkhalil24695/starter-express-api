const { adminRole, superVisorRole , reporterRole } = require("../../common/roles");
const {
AREA__CREATE_AREA,
AREA__GET_ALL_AREAS_NAMES,
AREA__GET_ALL_AREAS,
AREA__UPDATE_AREA,
AREA__DELETE_AREA

} = require('./helpers/constants').endPointsConstants;

module.exports = {
    [AREA__CREATE_AREA] :[
        adminRole
    ],
    [AREA__GET_ALL_AREAS_NAMES] :[
        adminRole, superVisorRole , reporterRole
    ],
    [AREA__GET_ALL_AREAS] :[
        adminRole
    ],
    [AREA__UPDATE_AREA] :[
        adminRole
    ],
    [AREA__DELETE_AREA] :[
        adminRole
    ],
}

