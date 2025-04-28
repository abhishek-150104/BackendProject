import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"


const app =express()

app.use(cors({
  origin: process.env.CORS_ORIGIN
})  )


//Limit the amount of JSON data to be accepted
app.use(express.json({limit:"16kb"}))

//how query is encoded in url
app.use(express.urlencoded({extended:true, limit:"16kb"}))

//is used to save files on local machine
app.use(express.static("public"))


//use to access and set cookie in user browser
app.use(cookieParser())


// routes import
import userRouter from './routes/user.routes.js';

app.get("/", (req, res) => {
  res.send("Backend is running ");
});

app.use("/api/v1/users",userRouter) // first i will go to ap1/v1/users then it will redirect to userRouter then in user routet we use http methods on  


//http://localhost:8000/api/v1/users/register

export {app} 