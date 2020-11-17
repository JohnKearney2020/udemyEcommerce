import express from 'express';
import multer from 'multer';
import path from 'path';

//=======================================
//Path that leads here: "/api/upload"
//=======================================

const router = express.Router();

//Multer Documentation:
// https://www.npmjs.com/package/multer

//initialize multer storage engine
const storage = multer.diskStorage({
  //the null you see is the error parameter. If we set to null we are saying there is no error. We will pass errors to it at various points
  destination(req, file, cb){ //cb is our call back function
    cb(null, 'uploads/');
  },
  //we must change the filename to handle cases where users upload two files with the same name
  //'path' from Node is used to get the file's original extension
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
  }

})

//Middleware file checking function
const checkFileType = (file, cb) => {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  //More info on MIME types: https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types
  //EX: jpeg's are 'image/jpeg'
  const mimetype = filetypes.test(file.mimetype);
  if(extname && mimetype){
    return cb(null, true)
  } else {
    cb('Images Only - must have be a .jpg, .jpeg, or .png file');
  }
}
//This is our middleware we'll pass to our route
const upload = multer({
  storage,
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
})

//You con upload multiple images, but we are doing just one here
router.post('/', upload.single('image'), (req, res) => {
  res.send(`/${req.file.path}`);
});

export default router;