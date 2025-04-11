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

  if(!fullName) missingFields.push("fullNmae");
  if(!email) missingFields.push("emial");
  if(!password) missingFields.push("password");
  if(!username) missingFields.push("username");


  const message = `The missing Fields are ${missingFields.join(",")}`

  throw new ApiError(400,message);
  
 }

//  User.findOne({email}) only checks one fields
    const existedUser=User.findOne({
      $or:[{username} , {email}]
    })

    if(!existedUser){
      throw new ApiError(409,"User Already exists")
    }

  const avatarlocalPath = req.files?.avatar[0]?.path;
  const coverImagelocalPath = req.files?.coverImage[0]?.path;
  if(!avatarlocalPath){
    throw new ApiError(400,"Avatar file is needed")
  }

  const avatar = await uploadOnCloundinary(avatarlocalPath)
  const coberImage = await uploadOnCloundinary(coverImagelocalPath)

  if(!avatar){
    throw new ApiError(400,"Avatar file is needed")
  }


  const user = User.create({
    fullName,
    avatar:avatar.url,
    coverImage:coberImage?.url || "",
    email,
    password,
    username:username.toLowerCase()

  })

  const createdUser = await User.findById(user._id)
.select(
  "-password -refreshToken"
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