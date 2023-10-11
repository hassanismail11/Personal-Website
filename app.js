const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const path = require('path');

const app = express();

app.set('views', (__dirname + "/views"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/" + "myblog");

// Posts DataBase
const postSchema = new mongoose.Schema({
  postTitle: String,
  postURL: String,
  postContent: String,
  postDate: String,
});

const Post = mongoose.model("Post", postSchema);
function newPost(postTitle, postContent, postDate) {
  const newPost = new Post({
    postTitle: postTitle,
    postURL: _.kebabCase(_.lowerCase(postTitle)),
    postContent: postContent,
    postDate: postDate,
  });

  newPost.save();
  console.log("New Post Added");
}

// Work Database
const workSchema = new mongoose.Schema({
  workTitle: String,
  workURL: String,
  workContent: String,
  workImageURL: String,
  workDate: String
});

const Work = mongoose.model("Work", workSchema);
function newWork(workTitle, workContent, workImageURL, workDate) {
  const newWork = new Work({
    workTitle: workTitle,
    workURL: _.kebabCase(_.lowerCase(workTitle)),
    workContent: workContent,
    workImageURL: workImageURL,
    workDate: workDate
  });

  newWork.save();
  console.log("New Work Added");
}

function getDate() {
  const today = new Date();

  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };

  return today.toLocaleDateString("en-US", options);
}

/* Home Page */

app.get("/", function (req, res) {
  res.render("home");
});

/* My Work Page */

app.get("/mywork", function (req, res) {
  Work.find({})
    .then((workPosts) => res.render("mywork", { works: workPosts }));
});

/* Compose work Page */

app.get("/composeWork", function (req, res) {
  res.render("composeWork");
});

app.post("/composeWork", function (req, res) {
  newWork();
  res.redirect("/mywork");
});

/* Work Page */

app.get("/work/:workTitle", function (req, res) {
  Work.find({ workURL: req.params.workTitle }).then((foundWork) =>
    res.render("work", { workPage: foundWork })
  );
});

/* About Page */

app.get("/about", function (req, res) {
  res.render("about");
});

/* Contact Page */

app.get("/contact", function (req, res) {
  res.render("contact");
});

app.post("/contact", function (req, res) {
  console.log(req.body.EMAIL);
});

/* Blog Page */

app.get("/blog", function (req, res) {
  Post.find({})
    .sort({ postTitle: 1 })
    .then((blogPosts) => res.render("blog", { posts: blogPosts }));
});

/* Compose Post Page */

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {
  newPost(req.body.postTitle, req.body.postText, getDate());
  res.redirect("/");
});

/* Post Page */

app.get("/posts/:posttitle", function (req, res) {
  Post.find({ postURL: req.params.posttitle }).then((foundPost) =>
    res.render("post", { postPage: foundPost })
  );
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
