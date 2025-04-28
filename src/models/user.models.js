import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase : true,
    trim:true,    
    index: true  //used for indexing purpose
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase : true,
    trim:true
  },
  fullName:{
    type: String,
    required: true,
    trim:true
  },
  avatar:{
    type:String ,//cloudinary url
    required:true,
  },
  coverImage:{
    type:String,
  },
  watchHistory:[
    {
      type:Schema.Types.ObjectId,
      ref:"Video"
    }
  ],
  password:{
    type:String,
    required:[true,"Password id required"],
  },
  refreshToken:{
    type:String
  }
},
{
  timestamps: true
}
)

userSchema.pre("save",async function(next) {
  if(!this.isModified("password")) return; // only if password is modified or save for first time
  this.password=await bcrypt.hash(this.password,10)
  next()
})
//                                  just before saving data on Databse do these   
//                                    cant use () => {} as arrow function doesn't have refernce of this / context
//                                    It is async because encryption takes time

//bcrypt.hash(what_to_hash,rounds)


userSchema.methods.isPassword = async function(password){
  return await bcrypt.compare(password, this.password); //returns boolean value
}


//Only differennce between the tokens are there expiry time
//Access Token are generally short lived
//If you have a access token then which ever feature that requires a authentication can be accessed with access token . //
//As it is short lived we need to login again and again to avoid this then comes in picture "Refresh Token" both the user and database has these token even then access token is necessary to validate . So one can hit the endpoint and if both the refresh token matches an access token is provided. 
userSchema.methods.generateAccessToken= function(){
  return jwt.sign(
    {
      _id:this.id,
      email: this.email,
      fullName:this.fullName
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
  )
}

//Referesh token have longer expiry time
userSchema.methods.generateRefreshToken = function(){
  return jwt.sign(
    {
      _id:this.id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }
  )
}


export const User = mongoose.model("User",userSchema);