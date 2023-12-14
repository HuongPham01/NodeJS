const util = require("util");
const path = require("path");
const multer = require("multer");

var storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null.path.join(`${__dirname}/../../uploads`));
  },
  filename: (req, file, callback) => {
    const match = ["image/png", "image/jpeg"];
    if (match.indexOf(file.mimetype) === -1) {
      var messenger = `${file.originalname} is valid. Only accept png/jpeg.`;
      return callback(messenger, null);
    }
    var filename = `${Date.now()}${file.originalname}`;
    callback(null, filename);
    var uploadFile = multer({ storage }).array("multi-files", 10);
    var uploadFileMiddleware = util.promisify(uploadFiles);
    module.exports = uploadFileMiddleware;
  },
});
