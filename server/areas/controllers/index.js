const areaService = require("../services/areaService");
const {
  AREA__CREATE_AREA,
  AREA__GET_ALL_AREAS_NAMES,
  AREA__GET_ALL_AREAS,
  AREA__UPDATE_AREA,
  AREA__DELETE_AREA,
} = require('../helpers/constants').endPointsConstants;

module.exports = {
 [AREA__CREATE_AREA] :async (req, res, next) => {
    try {
      const creationBody = req.body;
      const result = await areaService.createNewArea(creationBody)
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) { 
      return res.status(500).json({ message: 'Internal server error' , error : error.message });
    }
  } ,

  [AREA__GET_ALL_AREAS_NAMES] :async (req, res, next) => {
    try {
      const {page , limit, name } = req.query;
      const result = await areaService.getAllAreas({
        selector:{
          ... (name ? { name } : {}),
        },
        ...(page ? { page} : {}),
        ...(limit ? { limit} : {}),
        fields:['id','name'], 
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
  },

  [AREA__GET_ALL_AREAS] :async (req, res, next) => {
    try {
      const {page , limit, name } = req.query;
      const result = await areaService.getAllAreas({
        selector:{
          ... (name ? { name} : {}),
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
  },

  [AREA__UPDATE_AREA] :async (req, res, next) => {
    try {
      const {set, unset } = req.body;
      const { id } = req.params;
      const result = await areaService.updateAreaById(id, set, unset)
      return res.status(200).json({
        success: true,
       data: result,
      });
    } catch (error) { 
      return res.status(500).json({ message: 'Internal server error' , error : error.message });
    }
  },


  [AREA__DELETE_AREA] :async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await areaService.deleteAreaById(id)
      return res.status(200).json({
        success: true,
       data: result,
      });
    } catch (error) { 
      return res.status(500).json({ message: 'Internal server error' , error : error.message });
    }
  },
}






 
