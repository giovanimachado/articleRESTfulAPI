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

//Using app.route() form express
// https://expressjs.com/en/guide/routing.html

//**************** Requesting targetting all articles *********** //
app.route('/articles')

  .get(function(req, res){
    Article.find({}, function(err, searchResult){
      if (!err){
        // console.log(searchResult);
        res.send(searchResult);
      } else {
        res.send(err);
        console.log(err);
      }
    });
  })

  .post(function(req, res){
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
  })

  .delete(function(req, res) {
    Article.deleteMany({}, function (err) {
      if (!err){
        res.send("Articles deleted");
      } else {
        res.send(err);
    // deleted at most one tank document
      }
    });
  });

//************* Requesting targetting specifc article *********** //

app.route('/articles/:title')

  .get(function(req, res){
    Article.findOne({title: req.params.title}, function(err, searchResult){
      if (!err){
        // console.log(searchResult);
        if (searchResult){
          res.send(searchResult);
        } else {
          res.send("No article match this title");
        }
      } else {
        res.send(err);
        console.log(err);
      }
    });
  })

  .put(function(req, res){
    Article.update(
      {title: req.params.title}, // condition received through HTTP request
      {title: req.body.title, content: req.body.content}, // what update
      {overwrite: true}, // Substitute the document
      function(err, results){
        if(!err){
          res.send("Success: updated article");
        }
      }
    );
  })

  .patch(function(req, res){
    console.log("update: "+ req.body + " to: "+  req.body.title);
    Article.update(
      {title: req.params.title}, // condition received through HTTP request
      {$set: req.body}, // what needs to be updated
      function(err, results){
        if(!err){
          res.send("Success: updated with patch article");
        }
      }
    );
  })

  .delete(function(req, res) {
    Article.deleteOne({title: req.params.title}, function (err) {
      if (!err){
        res.send("Article "+ req.params.title +" deleted");
      } else {
        res.send(err);
    // deleted at most one tank document
      }
    });
  });


app.listen(3000, function(){
  console.log('Server is running on port 3000');
});
