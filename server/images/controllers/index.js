const imagesService = require("../services/imageService");
const {
IMAGES__UPLOAD_IMAGE,
IMAGES__GET_IMAGE,
IMAGES__DELETE_ALL_IMAGE,
} = require('../helpers/constants').endPointsConstants;

module.exports = {

  [IMAGES__GET_IMAGE] :async (req, res, next) => {
    try {
      const imageName = req.params.imageName;
      const result = await imagesService.getImage(imageName)
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) { 
      return res.status(500).json({ message: 'Internal server error' , error : error.message });
    }
  },

  [IMAGES__UPLOAD_IMAGE] :async (req, res, next) => {
    try {
      const result = await imagesService.AddImage(req);
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) { 
      return res.status(500).json({ message: 'Internal server error' , error : error.message });
    }
  },

  [IMAGES__DELETE_ALL_IMAGE] :async (req, res, next) => {
    try {
      const result = await imagesService.deleteAllImagesInBucket();
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) { 
      return res.status(500).json({ message: 'Internal server error' , error : error.message });
    }
  },
}






 
