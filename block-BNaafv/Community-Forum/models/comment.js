let mongoose = require("mongoose");

let Schema = mongoose.Schema;

let commentSchema = new Schema(
  {
    text: { type: String, unique: true, require: true },
    author: { type: Schema.Types.ObjectId, ref: "Profile" },
    answerId: { type: Schema.Types.ObjectId, ref: "Answer" },
    questionId: { type: Schema.Types.ObjectId, ref: "Question" },
  },
  { timestamps: true }
);

let Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;