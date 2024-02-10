const reportImagesModel = require("../model/index");
const _ = require("lodash");

async function createSingleReportImage(reportId, imageName) {
  try {
    const newReportImage= await reportImagesModel.create({reportId, 
      imageName
    });
    return newReportImage;
  } catch (error) {
    throw new Error(error);
  }
}


async function createBulkReportImage(reportId, imageNames,  transaction) {
  try {
   
    const newReportImages = await reportImagesModel.bulkCreate(reportId, imageNames, transaction)
    return newReportImages;
  } catch (error) {
    throw new Error(error);
  }
}



async function deleteReportImage(imagesIds , reportId, transaction) {
  try {
   
    await reportImagesModel.destroy({
      id: imagesIds,
      reportId
    }, transaction)
  } catch (error) {
    throw new Error(error);
  }
}


async function validateReportImages(imagesIds, reportId) {
  try {

    const images = await reportImagesModel.findAll(
      {
        id: imagesIds,
        reportId: reportId 
      },
      ['id'],
    );

    if (!images) {
      return false;
    }

    const existedImagesIds = images.map(action=>action.id);

    if(imagesIds.length != existedImagesIds.length ){
      return false;
    }

    return images;
  } catch (error) {
    throw  new Error(error);
  }
}

module.exports = {
  createSingleReportImage,
  createBulkReportImage,
  deleteReportImage,
  validateReportImages,
};
