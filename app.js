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
  url : String,
  shortCode : String
});

//make a collection called links in our url-shortener DB
var Links = mongoose.model('links', linkSchema);



//get route with link parameter
app.get('/new/:url(*)', function(req, res ,next){
  var url = req.params.url;
  var id = '';
  if(validUrl.isHttpUri(url) || validUrl.isHttpsUri(url)){
    Links.create({
      url : url,
      shortCode : shortId.generate()
    }, function(err, result){
      if(err){
        console.log(err);
      } else {
        console.log('Successful Add');
        console.log(result);
      }
    });

    // Links.findById(id, function(err, data){
    //   if(err){
    //     console.log(err);
    //   } else {
    //     console.log(data);
    //   }
    // });

    res.send(url);
  } else {
    res.send('Please Enter A Valid Url');
  }
});


app.listen(3000, function(){
  console.log('Listening on 3000');
});
