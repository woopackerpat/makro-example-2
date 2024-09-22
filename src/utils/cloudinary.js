const cloudinary = require("../config/cloudinary");
const uploadToCloudinary = async (files) => {
  const imagePromiseArray = [];

  for (let file of files) {
    const promiseUrl = cloudinary.uploader.upload(file.path);
    imagePromiseArray.push(promiseUrl);
  }

  const imageArray = await Promise.all(imagePromiseArray);

  return imageArray;
};

const removeFromCloudinary = async (cloudinaryId) => {
  cloudinary.uploader.destroy(cloudinaryId, function (error, result) {
    if (error) {
      console.error("Error deleting image:", error);
    } else {
      console.log("Image deleted successfully:", result);
    }
  });
};

module.exports = { uploadToCloudinary, removeFromCloudinary };
