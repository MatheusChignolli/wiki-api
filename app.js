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

app.listen(3000, () => {
  console.log("SERVER ON.\nPORT: http://localhost:3000/");
})