const AWS = require("aws-sdk");
const { awsBucket } = require("../../../config/envVariables");
const s3 = new AWS.S3()


async function getImage(imageName) {
  try {

    const params = {
      Bucket: awsBucket.awsBucketName,
      Key: imageName,
      Expires: 3600, // URL expiration time in seconds (1 hour)
    };

    const signedUrl = s3.getSignedUrl('getObject', params);

    return signedUrl;

  } catch (error) {
    throw new Error(error);
  }
}



async function AddImage(req) {
  try {
    const objectKey = `${Date.now()}` + '_' + req.file.originalname;
    const params = {
      Bucket: awsBucket.awsBucketName,
      Key: objectKey,
      Body: req.file.buffer,
      ContentType: 'image/png', // Set the content type to image/png
    };

    const uploadResponse = await s3.upload(params).promise();

    // Generate a public access URL for the uploaded image
    const publicUrl = uploadResponse.Location;

    return objectKey;
  } catch (error) {
    throw new Error(error);
  }
}

async function deleteAllImagesInBucket() {
  try {
  
    const objectList = await s3.listObjects({ Bucket: awsBucket.awsBucketName }).promise();
    if (objectList.Contents.length === 0) {
      return res.status(200).json({ message: 'Bucket is already empty.' });
    }

    const deleteObjectsParams = {
      Bucket: awsBucket.awsBucketName,
      Delete: {
        Objects: objectList.Contents.map(obj => ({ Key: obj.Key })),
        Quiet: false,
      },
    };
    return  await s3.deleteObjects(deleteObjectsParams).promise();

  } catch (error) {
    throw new Error(error);
  }
}
module.exports = {
  AddImage,
  getImage,
  deleteAllImagesInBucket,
};
