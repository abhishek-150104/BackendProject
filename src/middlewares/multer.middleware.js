import multer from "multer"

const storage = multer.diskStorage({
  destination: function (req, file, cb) // It tells multer where to save the uploaded files.
  {
    cb(null,"./public/temp" )
  },
  filename: function (req, file, cb)//: It determines the name of the saved file.
  //It creates a unique suffix using the current timestamp
   {
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    // cb(null, file.fieldname + '-' + uniqueSuffix)
    cb(null,file.originalname)  // will upload the file with name that user has given, not the optimal approach as multiple file with same name can be uploaded by the user 
  }
})

export const upload = multer({ storage: storage })