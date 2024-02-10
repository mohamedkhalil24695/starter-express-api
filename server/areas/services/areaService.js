const areasModel = require("../model/index");
const _ = require("lodash");

async function createNewArea(areaBody) {
  try {
    const name = areaBody.name;

    const area = await areasModel.findOne(
      {
        name,
      },
      ['id']      
    );

    if (area) {
      throw new Error("This area is already existed");
    }

    const newArea = await areasModel.create({ name });
    return newArea;
  } catch (error) {
    throw new Error(error);
  }
}

async function getAllAreas({ selector, page, limit, fields, sort }) {
  try {
    page = page & (page < 1) ? 1 : page;
    const areas = await areasModel.findAll(selector, fields, {
      offset: parseInt((page - 1) * limit),
      limit:parseInt(limit),
      sort,
    });
    return areas;
  } catch (error) {
    throw new Error(error);
  }
}

async function updateAreaById(areaId, setFields, unsetFields) {
  try {
    const area = await areasModel.findOne(
      {
        id: areaId,
      },
      
    ['id'],
      
    );

    if (!area) {
      throw new Error(`No area existed with this id: ${areaId}`);
    }

    return await areasModel.update(
      {
        id: areaId,
      },
      {
        $set: {
          ...(_.get(setFields, "name")
            ? { name: _.get(setFields, "name") }
            : {}),
        }
      }
    );
  } catch (error) {
    throw new Error(error);
  }
}


async function deleteAreaById(areaId) {
  try {
    const area = await areasModel.findOne(
      {
        id: areaId,
      },
        ['id'],
    );

    if (!area) {
      throw new Error(`No area existed with this id: ${areaId}`);
    }
    return await areasModel.destroy({
      id: areaId
    })

  } catch (error) {
    throw new Error(error);
  }
}



async function validateArea({areaId}) {
  try {
    const area = await areasModel.findOne(
      {
        ...(areaId ? {id:areaId}:{}),
      },
      ['id'],      
    );

    if (!area) {
      return false;
    }

    return area;
  } catch (error) {
    throw  new Error(error);
  }
}

module.exports = {
  createNewArea,
  getAllAreas,
  updateAreaById,
  deleteAreaById,
  validateArea
};
