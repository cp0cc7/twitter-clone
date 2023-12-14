import mongoose from "mongoose";
//creating the user fields
const eventSchema = new mongoose.Schema({
  eventName: {
    type: String,
    unique: true,
    required: true,
  },
  organiser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  imagePath: String,
  description: String,
  house: String,
  form: String,
  date: {
    type: Date,
    required: true,
  },
  interestedPeople: {
    type: Array<any>,
    ref: "Interested",
  }
});

const Event = mongoose.models.Event || mongoose.model("Event", eventSchema);

export default Event;