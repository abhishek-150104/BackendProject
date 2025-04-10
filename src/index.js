// require('dotenv').config({path: './env'});

import dotenv from "dotenv"

// import mongoose from "mongoose";
// import { DB_NAME } from "./constants.js";

// import express from "express"
import connectDB from "./db/db.js";
import { app } from "./app.js";

// const app = express();
dotenv.config({
  path:'./env'
})

connectDB()
.then(()=>{
  app.listen(process.env.PORT||8000,()=>{
    console.log("Serever Running at Port",process.env.PORT)
  })
})
.catch((err)=>{
  console.log("MongoDB connection failed",err)
})



// (async ()=>{
//   try{
//     await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//     app.on("error",()=>{
//       console.log("Error:",error);
//       throw error
//     })
//     app.listen(process.env.PORT,()=>{
//         console.log(`Appis listening on port ${process.env.PORT}`)
//     })
//   }

//   catch(error){
//     console.lof("Error:",error);

//   }

// })()