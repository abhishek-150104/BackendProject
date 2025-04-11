import cloudinary from "cloudinary";
import fs from "fs";// file system of node js . it is in node js by default . read ,write and permission and more 
// unlinking a path means unlinkinf the file(similar to delete but not exactly delete)

// import { cloudinary } from 'cloudinary';


cloudinary.config({ 
    cloud_name: process.env.CLOUNDINARY_CLOUD_NAME,
    api_key: process.env.CLOUNDINARY_API_KEY, 
    api_secret: process.env.CLOUNDINARY_API_SECRET
});


const uploadOnCloundinary = async (localFilePath) => {
  try{
    if(!localFilePath)  return null
    //upload File on cloudianry

    const response = await cloudinary.uploader.upload(localFilePath,{
      resource_type : "auto"
    })
    console.log("File uploaded successfully", response.url);
    fs.unlinkSync(localFilePath)
    return response;
  }
  catch (error){
    // if error has occred it means that file upload has stoped or wasn't able to upload . There is also a chance that some parts of file has been uploaded

    fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation git failed

    return null
  }
}


export {uploadOnCloundinary}