import {asyncHandler} from "../utils/asyncHnadler.js"
import { ApiError } from "../utils/apiError.js"
import jwt from "jsonwebtoken"
import { User } from "../models/user.models.js"

export const verifyJWT = asyncHandler(async (req,res,next)=>{
  try{
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")

    console.log(token)

  if(!token){
    throw new ApiError(401,"Unauthorized request")
  }

  const userInfo = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

  const user = await User.findById(userInfo?._id).select("-password -refreshToken") //missed await

  if (!user){
    throw new ApiError(401,"Invalid Token Access")
  }

  req.user = user;
  next();
}catch (error){
  throw new ApiError(401,error?.message || "Invalid Access Token")
}

})