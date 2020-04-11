//jshint esversion:6

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/wikiDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model('Article', articleSchema);

app.get('/articles', function(req, res){
  Article.find({}, function(err, searchResult){
    if (!err){
      // console.log(searchResult);
      res.send(searchResult);
    } else {
      res.send(err);
      console.log(err);
    }
  });
});

app.post('/articles', function(req, res){
  const articleTitle = req.body.title;
  const articleContent = req.body.content;
  const newArticle = new Article({
    title: articleTitle,
    content: articleContent
  });
  newArticle.save(function(err){
    if (!err){
      res.send("Success");
    } else {
      res.send(err);
    }
  });
  // To save data in MongoDB
});

app.delete('/articles', function(req, res) {
  Article.deleteMany({}, function (err) {
    if (!err){
      res.send("Articles deleted");
    } else {
      res.send(err);
  // deleted at most one tank document
    }
  });
});

app.listen(3000, function(){
  console.log('Server is running on port 3000');
});
