const { adminRole, reporterRole } = require("../../common/roles");
const { USER_GET_USERS, USER_REGISTER, USER_UPDATE_USER, USER_GET_USER_BY_ID, USER_DELETE_USER, USER_GET_USER_INFO,USER_CHANGE_PASSWORD} = require('./helpers/constants').endPointsConstants;

module.exports = {
    [USER_REGISTER] :[
        adminRole
    ],
    [USER_GET_USERS] :[
        adminRole,reporterRole
    ],   
    
    [USER_UPDATE_USER] :[
        adminRole
    ],  

    [USER_GET_USER_BY_ID]: [
        adminRole,
    ],

    [USER_DELETE_USER]: [
        adminRole,
    ],

    [USER_GET_USER_INFO]:[
        adminRole,reporterRole
    ],

    [USER_CHANGE_PASSWORD]:[
        adminRole,reporterRole
    ]
    
}