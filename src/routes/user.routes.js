import {Router} from "express";
import {registerUser} from "../controllers/user.contoller.js";
import {loginUser} from "../controllers/user.contoller.js";
import {logoutUser} from "../controllers/user.contoller.js";
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"


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

export default router