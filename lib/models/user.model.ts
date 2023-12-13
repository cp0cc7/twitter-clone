import mongoose from "mongoose";
//creating the user fields
const userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: String,
  bio: String,
  house: String,
  form: String,
  threads: [ //one user can have multiple references to a specific thread
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Thread",
    },
  ],
  events: [ //one user can have multiple references to a specific event(?)
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },
  ],
  onboarded: {
    type: Boolean,
    default: false,
  },
  communities: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
    },
  ],
  following: {
    type: Array<any>,
    ref: "Following",
    required: true
  },
  followers: {
    type: Array<any>,
    ref: "Followers",
    required: true
  }
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;