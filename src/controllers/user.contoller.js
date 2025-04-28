import { asyncHandler } from "../utils/asyncHnadler.js";
import {ApiError} from "../utils/apiError.js"
import {User} from "../models/user.models.js"
import {uploadOnCloundinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";


//Generate Access Token and Refresh Token
const generateAccessAndRefreshToken = async(userId) =>{

  try {
    const user = await User.findOne(userId);  // missed await
    const accessToken = user.generateAccessToken()
    console.log(accessToken)
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken

    // save is used save the chanes in db but there are field that are always needed so we use "validateBeforeSave : false" 
    await user.save({ validateBeforeSave : false })

    return { accessToken , refreshToken}

  } catch (error) {
    throw new ApiError(501,"Error while generating Token")
  }
}


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
  console.log(typeof(avatarlocalPath));
  
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

const loginUser = asyncHandler(async(req,res) =>{
  //req->body=data
  //username or email
  //finduser
  //password
  //password check
  //access token and refresh token
  //send cookie
  console.log("Request Body is: ", req.body);
  const {email,username,password} =req.body;

  if((!username && !email)){
    throw new ApiError(400,"Username or Email is Required")
  }


  //find user by email or username
  const user = await User.findOne({
    $or:[{username},{email}]
  })

  if(!user){
    throw new ApiError(404,"User Not Found")
  }

  const isPasswordValid=await user.isPassword(password);

  if(!isPasswordValid){
    throw new ApiError(401,"Incorrect Password")
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id) //


  //Even though we had a refrenece of user we again did a call to DB as then previous user didnt have the refresh token in it so we can either updated the existed user or just create new which ever is cheaper 
  const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

//It is done so that cookies can be modified only at backend not at frontend
  const options = {
    httpOnly: true,
    secure: true
  }
  // console.log(accessToken)
  return res.status(200)
  .cookie('accessToken',accessToken, options)
  .cookie('refreshToken',refreshToken,options)
  .json(new ApiResponse(
    200,
    {
      user: loggedInUser, accessToken,refreshToken
    },
    "User logged in Successfully"
  ))

})

const logoutUser = asyncHandler(async(req,res) =>{

  //The main problem is how to logout 
  //To logout we have remove cookies and reset the refresh token
  //Whose cookies to refresh we dont have access to user and we cant ask user to fill username or email while logging out in that case ant one can logout anyone

  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set:{
        refreshToken: undefined
      }
    },{
      //returned response will have new updated value
      new:true
    }
  )
  const options = {
    httpOnly: true,
    secure: true
  }

  return res
  .status(200)
  .clearCookie("accessToken",options)
  .clearCookie("refreshToken",options)
  .json(new ApiResponse(200,{},"User Logged Out"))
  

})

export {
  registerUser,
  loginUser,
  logoutUser
}