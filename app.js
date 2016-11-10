var express = require('express'),
    shortId = require('shortid'),
    validUrl = require('valid-url'),
    mongoose = require('mongoose'),

    bodyParser = require('body-parser'),
    app = express();

app.use(bodyParser.urlencoded({extended : true}));

//connect to Database
var config = require('./ignore');

mongoose.connect('mongodb://' + config.db.host + '/url-shortener');



var linkSchema = new mongoose.Schema({
  url : String,
  shortCode : String
});

//make a collection called links in our url-shortener DB
var Links = mongoose.model('links', linkSchema);



//get route with link parameter
app.get('/new/:url(*)', function(req, res ,next){
  var url = req.params.url;
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
        res.json(result);
    });
  } else {
    res.json({error: 'Please Enter A Valid URL'});
  }

});


//new route
app.get('/:short', function(req, res, next){
  var shortLink = req.params.short;

  Links.findOne({
    'shortCode' : shortLink
  }, function(err, doc){
    if(doc !== null){
      res.redirect(doc.url);
    } else {
      res.json({Error : 'No Link In Database'});
    }
  });
})


app.listen(8000, function(){
  console.log('Listening on 8000');
});
