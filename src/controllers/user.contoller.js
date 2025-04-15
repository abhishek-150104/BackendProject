import { asyncHandler } from "../utils/asyncHnadler.js";
import {ApiError} from "../utils/apiError.js"
import {User} from "../models/user.models.js"

import {uploadOnCloundinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler( async (req,res)=>{
 // get user details from frontend
 //validation (check wheather the input is in right format and non empty)
 //check if user already exists: Username or email
 //check for images, check for avatar
 //upload them to cloudinary , check avatar
 // create user object - create entry in db
 // remove password and refresh token field from response
 //check for user creation 
 // return response or send error

 const{fullName,email,username,password}=req.body;
 console.log("email:",email)

  

 if(fullName=="" || email=="" || password==""){
  const missingFields =[];

  if(!fullName) missingFields.push("fullName");
  if(!email) missingFields.push("emial");
  if(!password) missingFields.push("password");
  if(!username) missingFields.push("username");

 
  const message = `The missing Fields are ${missingFields.join(",")}` // printing all that is misssing

  throw new ApiError(400,message);
  
 }

//  User.findOne({email}) only checks one fields
// whenever interacting with database we will use await as we consider it may take time to fetch 
    const existedUser= await User.findOne({
      $or:[{username} , {email}]
    })

    console.log(existedUser)

    if(existedUser!=null){
      throw new ApiError(409,"User Already exists")
    }
    console.log(req.files)

  const avatarlocalPath = req.files?.avatar[0]?.path;
  
  let coverImagelocalPath;
  if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
    coverImagelocalPath=req.files.coverImage[0]?.path
  }

  if(!avatarlocalPath){
    throw new ApiError(400,"Avatar file is needed")
  }
  
  const avatar = await uploadOnCloundinary(avatarlocalPath)
  const coverImage = await uploadOnCloundinary(coverImagelocalPath)

  if(!avatar){
    throw new ApiError(400,"Avatar file is needed")
  }


  const user = await User.create({
    fullName,
    avatar:avatar.url,
    coverImage:coverImage?.url==null? "" : coverImage?.url,
    email,
    password,
    username:username.toLowerCase()

  })

  const createdUser = await User.findById(user._id)
.select(
  "-password -refreshToken"    //remove the fields that is not needed
  )


  if(!createdUser){
    throw new ApiError(500,"Something went error while registering user")
  }

  return res.status(201).json(
    new ApiResponse(200,createdUser,"User Registered Successfully")

  )
})


export {
  registerUser,
}