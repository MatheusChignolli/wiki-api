//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

const dbName = "wikiDB";

mongoose.connect(
  `mongodb://localhost:27017/${dbName}`, 
  {
    useUnifiedTopology: true,
    useNewUrlParser: true
  }
);

const articleSchema = mongoose.Schema({
  title: String,
  content: String
})

const Article = mongoose.model("Article", articleSchema);

app.route("/articles")
  .get(function (req, res) {
    Article.find({}, function (err, results) {
      if (!err) {
        res.send({
          articles: results
        });
      } else {
        res.send({
          error: err
        });
      }

    })
  })
  .post(function (req, res) {

    const title = req.body.title;
    const content = req.body.content;

    const article = new Article({
      title: title,
      content: content
    });

    article.save(function (err) {
      if (!err) {
        res.send("Created.");
      } else {
        res.send("Error.");
      }
    });
  })
  .delete(function (req, res) {

    Article.deleteMany({}, function (err) {
      if (!err) {
        res.send("Deleted.")
      } else {
        res.send("Error.");
      }
    })

  })

app.route("/articles/:title")
  .get(function(req, res) {

    const articleTitle = req.params.title;

    Article.findOne({
      title: articleTitle
    }, function(err, result) {
      if(!err) {
        res.send({
          article: result
        });
      } else {
        res.send({
          error: "Error."
        })
      }
    })

  })
  .put(function(req, res) {

    const articleTitle = req.params.title;

    const title = req.body.title;
    const content = req.body.content;

    Article.update({
      title: articleTitle
    }, {
      title: title,
      content: content
    },
    {
      overwrite: true
    }, function(err) {
      if(!err) {
        res.send("Updated.");
      } else {
        res.send("Error.")
      }
    })

  })
  .patch(function(req, res) {

    const articleTitle = req.params.title;

    const articleBody = req.body;

    Article.update({
      title: articleTitle
    }, {
      $set: articleBody
    }, {
      overwrite: true
    }, function (err) {
      if (!err) {
        res.send("Updated.");
      } else {
        res.send("Error.")
      }
    })

  })
  .delete(function(req, res) {

    const articleTitle = req.params.title;

    Article.deleteMany({
      title: articleTitle
    }, function(err) {
      if(!err) {
        res.send("Deleted.");
      } else {
        res.send("Error.");
      }
    })

  });

app.listen(3000, () => {
  console.log("SERVER ON.\nPORT: http://localhost:3000/");
})