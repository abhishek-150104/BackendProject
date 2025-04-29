import {Router} from "express";
import {refreshAccessToken, registerUser, changePassword,getCurrentUser} from "../controllers/user.contoller.js";
import {loginUser} from "../controllers/user.contoller.js";
import {logoutUser} from "../controllers/user.contoller.js";
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import {updateAccountDetails, updateUserAvatar, updateUserCoverImage} from "../controllers/user.contoller.js";



const router = Router();

//routing to registerUser but before that if we dealing with files then we need th handle the files so we use the upload.fields provided by multer so that 
//It can extracts the files from the request (req.files) and stores them temporarily (or in memory).

router.route("/register").post(
  upload.fields([
    {
      name:'avatar',
      maxCount: 1
    },
    {
      name:'coverImage',
      maxCount:1
    }
  ]),
  registerUser)

  router.route("/login").post(loginUser)

  //secured routes
  router.route("/logout").post(verifyJWT,logoutUser)
  //in verifyJWT at end we wrote next because router gets confused what to run so after verifyJWT there is 'next' function to run


  router.route("/refreshToken").post(refreshAccessToken)
  router.route("/changepassword").post(verifyJWT,changePassword)
  router.route("/getCurrentUser").post(verifyJWT,getCurrentUser)
  router.route("/updateAccountDetails").post(verifyJWT,updateAccountDetails)

  //verifyJWT first Use verifyJWT before upload.fields() to ensure only authenticated users can upload files, preventing unauthorized access and saving server resources.
  router.route("/updateUserAvatar").post(verifyJWT,
    upload.fields([
      {
        name:'avatar',
        maxCount: 1
      }]),
      updateUserAvatar)

  router.route("/updateUserCoverImage").post(verifyJWT,
    upload.fields([
      {
        name:'coverImage',
        maxCount: 1
      }]),
      updateUserCoverImage)



export default router
