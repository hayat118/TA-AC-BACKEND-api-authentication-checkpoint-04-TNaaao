var mongoose=require('mongoose');
var Schema= mongoose.Schema;

var profileSchema= new Schema({
  username: { type: String, unique: true, require: true },
  name: String,
  bio:String ,
  image: String ,
  isAdmin: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false },
  upvotedQuestions: [{ type: Schema.Types.ObjectId, ref: "Question" }],
  upvotedAnswers: [{ type: Schema.Types.ObjectId, ref: "Answer" }],
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
},{timestamps:true});

profileSchema.methods.profileJSON = async function () {
  let data = {
    name: this.name,
    username: this.username,
    bio: this.bio,
    image: this.image,
    isAdmin: this.isAdmin,
    isBlocked: this.isBlocked,
  };
  return data;
};

var Profile=mongoose.model("Profile",profileSchema);
module.exports=Profile;