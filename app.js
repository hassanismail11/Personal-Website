const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const aboutContent = "";
const contactContent = "";

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/" + "myblog");
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

/* Blog Page */

app.get("/blog", function (req, res) {
  Post.find({})
    .sort({ postTitle: 1 })
    .then((blogPosts) => res.render("blog", { posts: blogPosts }));
});

/* Work Page */

app.get("/mywork", function (req, res) {
  res.render("about", { aboutContent: aboutContent });
});

/* About Page */

app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutContent });
});

/* Contact Page */

app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
});

app.post("/contact", function (req, res) {
  console.log(req.body.EMAIL);
});

/* Compose Page */

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {
  newPost(req.body.postTitle, req.body.postText, getDate());
  res.redirect("/");
});

/* Post Page */

app.get("/:posttitle", function (req, res) {
  Post.find({ postURL: req.params.posttitle }).then((foundPost) =>
    res.render("post", { postPage: foundPost })
  );
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
