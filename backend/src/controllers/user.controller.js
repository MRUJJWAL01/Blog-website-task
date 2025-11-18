const userModel = require("../models/user.model");
const uploadImage = require("../services/storage.services");

const userDpController = async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log(userId);
    
    

    if (!req.file) {
      return res.status(404).json({
        msg: "file not found",
      });
    }
  
    let imageUrl = await uploadImage(req.file.buffer, req.file.originalname);
    console.log(imageUrl);
    
    let updateUser = await userModel.findByIdAndUpdate({_id:userId},
      { dp: imageUrl.url },
      { new: true }
    );
    return res.status(200).json({
      msg: "profile photo uploaded",
      user:updateUser
    });
  } catch (error) {
    console.error("Error in uploadDpController:", error);
    return res.status(500).json({
      msg: "Internal server error",
      error,
    });
  }
};

module.exports = {
    userDpController
}