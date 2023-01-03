var express = require("express");
const auth = require("../middlewares/auth");
const Answer = require("../models/answer");
const Profile = require("../models/profile");
const Question = require("../models/question");
const User = require("../models/user");
const Comment = require("../models/comment");
var router = express.Router();

//update answer

router.put("/:answerId", auth.isLoggedIn, async (req, res, next) => {
  let answerId = req.params.answerId;
  let data = req.body;
  let loggedUser = req.user;

  try {
    let answer = await Answer.findById(answerId).populate("author");

    if (loggedUser.username === answer.author.username) {
      let updatedAnswer = await Answer.findByIdAndUpdate(answerId, data);

      return res.json({ answer: updatedAnswer });
    } else {
      return res.json({ error: "only author of answer can edit it" });
    }
  } catch (error) {
    next(error);
  }
});

//delete answer

router.delete("/:answerId", auth.isLoggedIn, async (req, res, next) => {
  let answerId = req.params.answerId;

  let loggedUser = req.user;

  try {
    let answer = await Answer.findById(answerId).populate("author");

    if (loggedUser.username === answer.author.username) {
      let deletedAnswer = await Answer.findByIdAndDelete(answerId);

      let updatedQuestion = await Question.findByIdAndUpdate(
        deletedAnswer.questionId,
        { $pull: { answers: deletedAnswer.id } }
      );

      let updatedUser = await User.findOneAndUpdate(
        { username: loggedUser.username },
        { $pull: { answers: deletedAnswer.id } }
      );

      return res.json({ answer: deletedAnswer });
    } else {
      return res.json({ error: "only author of answer can delete it" });
    }
  } catch (error) {
    next(error);
  }
});

//upvote answerId

router.get("/upvote/:answerId", auth.isLoggedIn, async (req, res, next) => {
  let answerId = req.params.answerId;
  try {
    let loggedProfile = await Profile.findOne({ username: req.user.username });

    let updatedAnswer = await Answer.findByIdAndUpdate(answerId, {
      $inc: { upvoteCount: 1 },
      $push: { upvotedBy: loggedProfile.id },
    });

    let updatedProfile = await Profile.findByIdAndUpdate(loggedProfile.id, {
      $push: { upvotedAnswers: updatedAnswer.id },
    });

    return res.json({ answer: updatedAnswer });
  } catch (error) {
    next(error);
  }
});

//remove upvote answerId

router.get(
  "/removeupvote/:answerId",
  auth.isLoggedIn,
  async (req, res, next) => {
    let answerId = req.params.answerId;
    try {
      let loggedProfile = await Profile.findOne({
        username: req.user.username,
      });

      let updatedAnswer = await Answer.findByIdAndUpdate(answerId, {
        $inc: { upvoteCount: -1 },
        $pull: { upvotedBy: loggedProfile.id },
      });

      let updatedProfile = await Profile.findByIdAndUpdate(loggedProfile.id, {
        $pull: { upvotedAnswers: updatedAnswer.id },
      });

      return res.json({ answer: updatedAnswer });
    } catch (error) {
      next(error);
    }
  }
);

//create new comment on answer

router.post("/comment/:answerId", auth.isLoggedIn, async (req, res, next) => {
  let loggedProfile = req.user;
  let answerId = req.params.answerId;

  let data = req.body;
  try {
    let profile = await Profile.findOne({ username: loggedProfile.username });

    data.author = profile.id;
    data.answerId = answerId;
    let comment = await Comment.create(data);

    let updatedAnswer = await Answer.findByIdAndUpdate(answerId, {
      $push: { comments: comment.id },
    });

    let updatedProfile = await Profile.findByIdAndUpdate(profile.id, {
      $push: { comments: comment.id },
    });

    return res.json({ comment });
  } catch (error) {
    next(error);
  }
});

module.exports = router;