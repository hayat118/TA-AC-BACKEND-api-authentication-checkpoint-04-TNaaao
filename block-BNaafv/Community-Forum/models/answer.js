let mongoose = require("mongoose");

let Schema = mongoose.Schema;

let answerSchema = new Schema(
  {
    text: { type: String, unique: true, require: true },
    author: { type: Schema.Types.ObjectId, ref: "Profile" },
    upvoteCount: { type: Number, default: 0 },
    upvotedBy: [{ type: Schema.Types.ObjectId, ref: "Profile" }],
    questionId: { type: Schema.Types.ObjectId, ref: "Question" },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

let Answer = mongoose.model("Answer", answerSchema);
module.exports = Answer;