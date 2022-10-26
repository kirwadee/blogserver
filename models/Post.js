import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      required: false,
    },
    cat: {
      type: String,
      default: "",
    },
    likedBy: {
      type: [String],
      default: [],
    },
    dislikedBy: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);
