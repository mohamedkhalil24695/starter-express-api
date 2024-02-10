const departmentService = require("../services/departmentService");
const {
  DEPARTMENT__CREATE_DEPARTMENT,
  DEPARTMENT__GET_ALL_DEPARTMENTS_NAMES,
  DEPARTMENT__GET_ALL_DEPARTMENTS,
  DEPARTMENT__UPDATE_DEPARTMENT,
  DEPARTMENT__DELETE_DEPARTMENT,
} = require('../helpers/constants').endPointsConstants;

module.exports = {
 [DEPARTMENT__CREATE_DEPARTMENT] :async (req, res, next) => {
    try {
      const creationBody = req.body;
      const result = await departmentService.createNewDepartment(creationBody)
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) { 
      return res.status(500).json({ message: 'Internal server error' , error : error.message });
    }
  } ,

  [DEPARTMENT__GET_ALL_DEPARTMENTS_NAMES] :async (req, res, next) => {
    try {
      const {page , limit, name , nameAr } = req.query;
      const result = await departmentService.getAllDepartments({
        selector:{
          ... (name ? { name } : {}),
          ... (nameAr ? { nameAr } : {}),
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
  },

  [DEPARTMENT__GET_ALL_DEPARTMENTS] :async (req, res, next) => {
    try {
      const {page , limit, name , nameAr } = req.query;
      const result = await departmentService.getAllDepartments({
        selector:{
          ... (name ? { name} : {}),
          ... (nameAr ? { nameAr} : {}),

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

  [DEPARTMENT__UPDATE_DEPARTMENT] :async (req, res, next) => {
    try {
      const {set, unset } = req.body;
      const { id } = req.params;
      const result = await departmentService.updateDepartmentById(id, set, unset)
      return res.status(200).json({
        success: true,
       data: result,
      });
    } catch (error) { 
      return res.status(500).json({ message: 'Internal server error' , error : error.message });
    }
  },


  [DEPARTMENT__DELETE_DEPARTMENT] :async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await departmentService.deleteDepartmentById(id)
      return res.status(200).json({
        success: true,
       data: result,
      });
    } catch (error) { 
      return res.status(500).json({ message: 'Internal server error' , error : error.message });
    }
  },
}






 
