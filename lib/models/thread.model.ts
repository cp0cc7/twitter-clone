import mongoose from "mongoose";

const threadSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Community",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  parentId: {
    type: String,
  },
  children: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Thread", // allows one thread to have multiple children(comments)
    },
  ],
  likes: { //added likes as a required array type of any
    type: Array<any>, 
    ref: "Likes",
    requried: true
  }
});

const Thread = mongoose.models.Thread || mongoose.model("Thread", threadSchema); //change this constant to blog and that will let me use blog elsewhere

export default Thread;