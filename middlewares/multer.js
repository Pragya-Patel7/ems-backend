const multer = require("multer");

const Storage = multer.diskStorage({
    destination: "storage/poll_images",
    filename: (req, file, cb) => {
        cb(null, new Date().toJSON().slice(0, 10) + file.originalname);
    }
})

const upload = multer({storage: Storage})

module.exports = upload;