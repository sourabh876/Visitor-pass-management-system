const multer = require("multer");
const fs = require("fs");
const path = require("path");


const uploadPath = "uploads/visitors";

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true })
}

const storage = multer.diskStorage({

    destination(req, file, cb) {
        cb(null, uploadPath)
    },

    filename(req, file, cb) {

        const uniqueName = Date.now() + "-" + Math.round(Math.random()* 1e9)

        cb(null,
            uniqueName + path.extname(file.originalname))

    }

})

const fileFilter = (req, file, cb) =>{

   const allowed = /jpeg|jpg|png/

   const valid = 
    allowed.test(path.extname(file.originalname).toLowerCase()) &&
    allowed.test(file.mimetype)

    if(valid){
        cb(null, true)
    }else{
        cb(new Error("Only Jpeg, Jpg and Png Images are allowed"))
    }

}

module.exports = multer({
    storage,
    fileFilter
})