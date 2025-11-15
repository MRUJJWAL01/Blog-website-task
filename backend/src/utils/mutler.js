const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({storage});
if(!upload){
    console.log("nhi aa yi ");
    
}

module.exports = upload;