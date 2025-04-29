
import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema({
  subscriber :{
    type: Schema.Types.ObjectId,
    ref : "User"
  },
  channel:{
    type : Schema.Types.ObjectId,
    ref: "User"
  }
},
{
  timestamp : 'true'
})

export const Subscritption = mongoose.model("Subscritption",subscriptionSchema)