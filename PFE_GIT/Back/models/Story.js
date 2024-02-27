// models/Story.js

const mongoose = require("mongoose");

const storySchema = new mongoose.Schema({
  videoUrl: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  membersLiked: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const Story = mongoose.model("Story", storySchema);

module.exports = Story;
