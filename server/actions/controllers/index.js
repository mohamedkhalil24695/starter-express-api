const actionService = require("../services/actionService");
const { ACTION__CREATE_ACTION, ACTION__GET_ALL_ACTIONS_NAMES, ACTION__GET_ALL_ACTIONS
,ACTION__UPDATE_ACTION , ACTION__DELETE_ACTION } = require('../helpers/constants').endPointsConstants;

module.exports = {
 [ACTION__CREATE_ACTION] :async (req, res, next) => {
    try {
      const creationBody = req.body;
      const result = await actionService.createNewAction(creationBody)
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) { 
      return res.status(500).json({ message: 'Internal server error' , error : error.message });
    }
  } ,

  [ACTION__GET_ALL_ACTIONS_NAMES] :async (req, res, next) => {
    try {
      const {page , limit, name , nameAr , type } = req.query;
      const result = await actionService.getAllActions({

        selector:{
          ... (name ? { name} : {}),
          ... (nameAr ? { nameAr} : {}),
          ...(type ? {type}:{})
        },
        ...(page ? { page} : {}),
        ...(limit ? { limit} : {}),
        fields:['id','name', 'nameAr'], 
        sort:{
          name: 1
        }
      });
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) { 
      return res.status(500).json({ message: 'Internal server error' , error : error.message });
    }
  } ,


  [ACTION__GET_ALL_ACTIONS] :async (req, res, next) => {
    try {
      const {page , limit, name , nameAr, type } = req.query;
      const result = await actionService.getAllActions({

        selector:{
          ... (name ? { name} : {}),
          ... (nameAr ? { nameAr} : {}),

          ...(type ? {type}:{})
        },
        ...(page ? { page} : {}),
        ...(limit ? { limit} : {}),
        sort:{
          createdAt: 1
        }
      });
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) { 
      return res.status(500).json({ message: 'Internal server error' , error : error.message });
    }
  } ,

  [ACTION__UPDATE_ACTION] :async (req, res, next) => {
    try {
      const {set, unset } = req.body;
      const { id } = req.params;
      const result = await actionService.updateActionById(id, set, unset)
      return res.status(200).json({
        success: true,
       data: result,
      });
    } catch (error) { 
      return res.status(500).json({ message: 'Internal server error' , error : error.message });
    }
  },

  [ACTION__DELETE_ACTION] :async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await actionService.deleteActionById(id)
      return res.status(200).json({
        success: true,
       data: result,
      });
    } catch (error) { 
      return res.status(500).json({ message: 'Internal server error' , error : error.message });
    }
  },

}






 
