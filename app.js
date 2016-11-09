var express = require('express'),
    shortId = require('shortid'),
    validUrl = require('valid-url'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    app = express();

app.use(bodyParser.urlencoded({extended : true}));

//connect to Database
mongoose.connect('mongodb://localhost/url-shortener');

var linkSchema = new mongoose.Schema({
  url : String
});

//make a collection called links in our url-shortener DB
var Links = mongoose.model('links', linkSchema);



//get route with link parameter
app.get('/new/:url(*)', function(req, res ,next){
  var url = req.params.url;
  if(validUrl.isHttpUri(url) || validUrl.isHttpsUri(url)){
    Links.create({
      url : url
    }, function(err, result){
      if(err){
        console.log(err);
      } else {
        console.log('Successful Add');
        console.log(result);
      }
    });
  } else {
    res.send('Please Enter A Valid Url');
  }
  res.send(url);
});


app.listen(3000, function(){
  console.log('Listening on 3000');
});
