var express = require("express");
const auth = require("../middlewares/auth");
const Answer = require("../models/answer");
const Profile = require("../models/profile");
const Question = require("../models/question");
const User = require("../models/user");
const Comment = require("../models/comment");
var router = express.Router();

/* create new question */

router.post("/", auth.isLoggedIn, async function (req, res, next) {
  let loggedUser = req.user;
  let data = req.body;

  try {
    let profile = await Profile.findOne({ username: loggedUser.username });
    data.author = profile.id;
    let question = await Question.create(data);

    let updatedUser = await User.findOneAndUpdate(
      { username: loggedUser.username },
      { $push: { questions: question.id } }
    );

    res.json({ question });
  } catch (error) {
    next(error);
  }
});

//get list of all questions

router.get("/", auth.isLoggedIn, async function (req, res, next) {
  let loggedUser = req.user;

  try {
    let questions = await Question.find({});

    res.json({ questions });
  } catch (error) {
    next(error);
  }
});

/* update question */

router.put("/:questionId", auth.isLoggedIn, async function (req, res, next) {
  try {
    let loggedUser = req.user;
    let data = req.body;
    let questionId = req.params.questionId;

    let question = await Question.findById(questionId).populate("author");

    if (question.author.username === loggedUser.username) {
      let updatedQuestion = await Question.findByIdAndUpdate(questionId, data);

      return res.json({ question: updatedQuestion });
    } else {
      return res
        .status(400)
        .json({ error: "only creater of question can edit question" });
    }
  } catch (error) {
    next(error);
  }
});

/* delete  question */

router.delete("/:slug", auth.isLoggedIn, async function (req, res, next) {
  let loggedUser = req.user;
  let slug = req.params.slug;

  try {
    let question = await Question.findOneAndDelete({ slug });

    let updatedUser = await User.findOneAndUpdate(
      { username: loggedUser.username },
      { $pull: { questions: question.id } }
    );

    res.json({ question });
  } catch (error) {
    next(error);
  }
});

//create new answer

router.post("/:questionId/answers", auth.isLoggedIn, async (req, res, next) => {
  let questionId = req.params.questionId;
  let loggedUser = req.user;

  let data = req.body;
  try {
    let profile = await Profile.findOne({ username: loggedUser.username });

    data.author = profile.id;
    data.questionId = questionId;

    let answer = await Answer.create(data);

    let updatedQuestion = await Question.findByIdAndUpdate(questionId, {
      $push: { answers: answer.id },
    });

    let updatedUser = await User.findOneAndUpdate(
      { username: loggedUser.username },
      { $push: { answers: answer.id } }
    );

    res.json({ answer });
  } catch (error) {
    next(error);
  }
});

//list of all answers of question

router.get("/:questionId/answers", auth.isLoggedIn, async (req, res, next) => {
  let questionId = req.params.questionId;
  let loggedUser = req.user;

  try {
    let question = await Question.findById(questionId).populate("answers");

    return res.json({ answers: question.answers });
  } catch (error) {
    next(error);
  }
});

//upvote question

router.get("/upvote/:questionId", auth.isLoggedIn, async (req, res, next) => {
  let questionId = req.params.questionId;
  try {
    let loggedProfile = await Profile.findOne({ username: req.user.username });

    let updatedQuestion = await Question.findByIdAndUpdate(questionId, {
      $inc: { upvoteCount: 1 },
      $push: { upvotedBy: loggedProfile.id },
    });

    let updatedProfile = await Profile.findByIdAndUpdate(loggedProfile.id, {
      $push: { upvotedQuestions: updatedQuestion.id },
    });

    return res.json({ question: updatedQuestion });
  } catch (error) {
    next(error);
  }
});

//remove upvote question

router.get(
  "/removeupvote/:questionId",
  auth.isLoggedIn,
  async (req, res, next) => {
    let questionId = req.params.questionId;
    try {
      let loggedProfile = await Profile.findOne({
        username: req.user.username,
      });

      let updatedQuestion = await Question.findByIdAndUpdate(questionId, {
        $inc: { upvoteCount: -1 },
        $pull: { upvotedBy: loggedProfile.id },
      });

      let updatedProfile = await Profile.findByIdAndUpdate(loggedProfile.id, {
        $pull: { upvotedQuestions: updatedQuestion.id },
      });

      return res.json({ question: updatedQuestion });
    } catch (error) {
      next(error);
    }
  }
);

//create new comment on question

router.post("/comment/:questionId", auth.isLoggedIn, async (req, res, next) => {
  let loggedProfile = req.user;
  let questionId = req.params.questionId;

  let data = req.body;
  try {
    let profile = await Profile.findOne({ username: loggedProfile.username });

    data.author = profile.id;
    data.questionId = questionId;
    let comment = await Comment.create(data);

    let updatedQuestion = await Question.findByIdAndUpdate(questionId, {
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

module.exports = router