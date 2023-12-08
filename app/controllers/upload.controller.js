const multer = require("multer");
const path = require("path");

// Controller function for handling file upload
const uploadSingleFile = (req, res) => {
  // The 'file' field in the request object contains the uploaded file
  if (!req.file) {
    return res.status(400).send("Upload image fail.");
  }

  // You can perform additional actions with the uploaded file if needed

  res.send("Upload image success!");
};

module.exports = {
  uploadSingleFile,
};
