const endPointsConstants = {
    ACTION__CREATE_ACTION : 'ACTION__CREATE_ACTION',
    ACTION__GET_ALL_ACTIONS_NAMES: 'ACTION__GET_ALL_ACTIONS_NAMES', 
    ACTION__UPDATE_ACTION : 'ACTION__UPDATE_ACTION' , 
    ACTION__DELETE_ACTION:'ACTION__DELETE_ACTION'
}

const safeAction = "SAFE_ACTION";
const unSafeAction = "UN_SAFE_ACTION";

const reportActions = [safeAction, unSafeAction];



module.exports = {
    endPointsConstants,
    reportActions,
}