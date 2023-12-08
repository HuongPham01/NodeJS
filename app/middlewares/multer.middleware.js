// Set up Multer

const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Set the destination folder for storing uploaded files
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // Set the filename for the uploaded file
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

module.exports = upload;
