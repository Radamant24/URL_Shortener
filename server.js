
var express = require('express');
var mongodb = require('mongodb');
var shortid = require('shortid');
var isUrl  = require('is-url');
var app = express();


app.use(express.static('public'));


var newEntry = {
 verifiedUrl: "",
  _id:"",

}


// Standard URI format: mongodb://[dbuser:dbpassword@]host:port/dbname, details set in .env
var uri = 'mongodb://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST+':'+process.env.PORT+'/'+process.env.DB;

mongodb.MongoClient.connect(uri, function(err, db) {
  if(err) throw err;
  
  var urldb = db.collection('urldb');
  
  app.get("/", function (req, res) {
     res.sendFile("home.html",{root: __dirname });

  })

  app.get("/:target", function (req, res) {
      var target = req.params.target;
      urldb.findOne({_id:target}, function(err, result) {
      if (err) throw err;
      if(result){res.redirect(result.verifiedUrl);}
        else res.send('No such URL in the database');
      
  });
      

  })

  app.get('/new/:url(*)', function (req, res) { 
  var url = req.params.url;
  if (isUrl(url)){
      newEntry.verifiedUrl = url;
      newEntry._id = shortid.generate();
      urldb.insert(newEntry, function(error,data){
        if (err) throw err;
     var obj = {"original-url":url,"short-url":"https://shrtr.glitch.me/" + newEntry._id};
      res.send(obj);
      });
      
        }
     else res.send({"error":"Wrong url format! Make sure you have a valid protocol and real site."});
 })
         
         
// listen for requests :)
var listener = app.listen("3000", function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

  
  
});
  

