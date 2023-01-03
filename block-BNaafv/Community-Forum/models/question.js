let mongoose = require("mongoose");
let slugger = require("slugger");

let Schema = mongoose.Schema;

let questionSchema = new Schema(
  {
    title: { type: String, unique: true, require: true },
    description: String ,
    slug:  String ,
    author: { type: Schema.Types.ObjectId, ref: "Profile" },
    upvoteCount: { type: Number, default: 0 },
    upvotedBy: [{ type: Schema.Types.ObjectId, ref: "Profile" }],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    tags: [{ type: String }],
    answers: [{ type: Schema.Types.ObjectId, ref: "Answer" }],
  },
  { timestamps: true }
);

questionSchema.pre("save", function (next) {
  this.slug = slugger(this.title);
  next();
});

let Question = mongoose.model("Question", questionSchema);
module.exports = Question;