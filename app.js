require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const path = require("path");

const app = express();

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const { MongoClient, ServerApiVersion } = require("mongodb");
// Replace with your Atlas connection string
const uri = process.env.CLIENT_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let Posts = [];
let post = {};

async function findPosts(_callback) {
  try {
    await client.connect();

    Posts = await client
      .db("personal-website")
      .collection("posts")
      .find()
      .toArray();
  } finally {
    _callback();
  }
}

async function findPostByURL(postURL, _callback) {
  try {
    await client.connect();

    post = await client
      .db("personal-website")
      .collection("posts")
      .findOne({postURL:postURL});

  } finally {
    _callback();
  }
}

let Works = [];
let work = {};

async function findWorks(_callback) {
  try {
    await client.connect();

    Works = await client
      .db("personal-website")
      .collection("works")
      .find()
      .toArray();
  } finally {
    _callback();
  }
}

async function findWorkByURL(workURL, _callback) {
  try {
    await client.connect();

    work = await client
      .db("personal-website")
      .collection("works")
      .findOne({workURL:workURL});

  } finally {
    _callback();
  }
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
  findWorks(function () {
    res.render("mywork", { works: Works });
  });
});

/* Work Page */

app.get("/myworks/:workTitle", function (req, res) {
  findWorkByURL(req.params.workTitle, function(){
    res.render("work", { work: work })
  })
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
  findPosts(function () {
    res.render("blog", { posts: Posts });
  });
});

/* Post Page */

app.get("/posts/:posttitle", function (req, res) {
  findPostByURL(req.params.posttitle, function(){
    res.render("post", { postPage: post })
  })
});

/* 404 NOT FOUND */

app.use((req, res, next) => { 
  res.status(404).render("notfound");
}) 

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
