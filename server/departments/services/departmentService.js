const departmentsModel = require("../model/index");
const _ = require("lodash");

async function createNewDepartment(departmentBody) {
  try {
    const name = departmentBody.name;
    const nameAr = departmentBody.nameAr;

    const department = await departmentsModel.findOne(
      {
        name,
        nameAr
      },
      ['id']      
    );

    if (department) {
      throw new Error("This department is already existed");
    }

    const newDepartment = await departmentsModel.create({ name, nameAr });
    return newDepartment;
  } catch (error) {
    throw new Error(error);
  }
}

async function getAllDepartments({ selector, page, limit, fields, sort }) {
  try {
    page = page & (page < 1) ? 1 : page;
    const departments = await departmentsModel.findAndCountAll(selector, fields, {
      offset: parseInt((page - 1) * limit),
      limit:parseInt(limit),
      sort,
    });
    return {
      departments: departments.rows,
      count: departments.count
    };
  } catch (error) {
    throw new Error(error);
  }
}

async function updateDepartmentById(departmentId, setFields, unsetFields) {
  try {
    const department = await departmentsModel.findOne(
      {
        id: departmentId,
      },
      
    ['id'],
      
    );

    if (!department) {
      throw new Error(`No department existed with this id: ${departmentId}`);
    }

    return await departmentsModel.update(
      {
        id: departmentId,
      },
      {
        $set: {
          ...(_.get(setFields, "name")
            ? { name: _.get(setFields, "name") }
            : {}),

            ...(_.get(setFields, "nameAr")
            ? { nameAr: _.get(setFields, "nameAr") }
            : {}),
        }
      }
    );
  } catch (error) {
    throw new Error(error);
  }
}


async function deleteDepartmentById(departmentId) {
  try {
    const department = await departmentsModel.findOne(
      {
        id: departmentId,
      },
        ['id'],
    );

    if (!department) {
      throw new Error(`No department existed with this id: ${departmentId}`);
    }
    return await departmentsModel.destroy({
      id: departmentId
    })

  } catch (error) {
    throw new Error(error);
  }
}



async function validateDepartment({departmentId}) {
  try {
    const department = await departmentsModel.findOne(
      {
        ...(departmentId ? {id:departmentId}:{}),
      },
      ['id'],      
    );

    if (!department) {
      return false;
    }

    return department;
  } catch (error) {
    throw  new Error(error);
  }
}

module.exports = {
  createNewDepartment,
  getAllDepartments,
  updateDepartmentById,
  deleteDepartmentById,
  validateDepartment
};
