import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"


const app =express()

app.use(cors({
  origin: process.env.CORS_ORIGIN
})  )

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true, limit:"16kb"}))
app.use(express.static("public"))

app.use(cookieParser())


// routes import
import userRouter from './routes/user.routes.js';

app.get("/", (req, res) => {
  res.send("Backend is running ");
});

app.use("/api/v1/users",userRouter) // first i will go to ap1/v1/users then it will redirect to userRouter then in user routet we use http methods on  


//http://localhost:8000/api/v1/users/register

export {app} 