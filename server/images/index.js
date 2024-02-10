const express = require('express');
const router = express.Router();
const imagesController = require('./controllers/index');
const multer = require('multer'); // For handling file uploads
const authenticateUser = require('../../common/authenticator');
const authorizeUser = require('../../common/authorizer');
const roles = require('./roles');
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: {
      fileSize: 1024 * 1024 * 10
    }  });
const {
IMAGES__UPLOAD_IMAGE,
IMAGES__GET_IMAGE,
IMAGES__DELETE_ALL_IMAGE,
} = require('./helpers/constants').endPointsConstants;


router.post('/',
authenticateUser,
authorizeUser(roles[IMAGES__UPLOAD_IMAGE]),
upload.single('image'),
imagesController[IMAGES__UPLOAD_IMAGE]
);


router.get('/:imageName',
authenticateUser,
authorizeUser(roles[IMAGES__GET_IMAGE]),
imagesController[IMAGES__GET_IMAGE]
);

router.delete('/allImages',
authenticateUser,
authorizeUser(roles[IMAGES__DELETE_ALL_IMAGE]),
imagesController[IMAGES__DELETE_ALL_IMAGE]
);

module.exports = router;

