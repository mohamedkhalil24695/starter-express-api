const { adminRole, superVisorRole , reporterRole } = require("../../common/roles");
const {
    IMAGES__UPLOAD_IMAGE,
    IMAGES__GET_IMAGE,
    IMAGES__DELETE_ALL_IMAGE
} = require('./helpers/constants').endPointsConstants;

module.exports = {
    [IMAGES__UPLOAD_IMAGE] :[
        adminRole,reporterRole
    ],
    [IMAGES__GET_IMAGE] :[
        adminRole,reporterRole
    ], 
     [IMAGES__DELETE_ALL_IMAGE] :[
        adminRole
    ],

}

