var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var express = require('express');
var webpack = require('webpack');
var webpackDevServer = require('webpack-dev-server');
var webpackMiddleware = require("webpack-dev-middleware");
var webpackHotMiddleware = require('webpack-hot-middleware');
var webpackConfig = require('./webpack.config');

var app = express();

//declare static path

app.use('/pages', express.static(__dirname + '/client/pages'));

var url = 'mongodb://localhost:27017/test';

var port = process.env.PORT || 8080;

var insertDocument = function(db, callback) {
   db.collection('restaurants').insertOne( {
      "address" : {
         "street" : "2 Avenue",
         "zipcode" : "10075",
         "building" : "1480",
         "coord" : [ -73.9557413, 40.7720266 ]
      },
      "borough" : "Manhattan",
      "cuisine" : "Italian",
      "grades" : [
         {
            "date" : new Date("2014-10-01T00:00:00Z"),
            "grade" : "A",
            "score" : 11
         },
         {
            "date" : new Date("2014-01-16T00:00:00Z"),
            "grade" : "B",
            "score" : 17
         }
      ],
      "name" : "Vella",
      "restaurant_id" : "41704620"
   }, function(err, result) {
    assert.equal(err, null);
    console.log("Inserted a document into the restaurants collection.");
    callback();
  });
};

var findRestaurants = function(db, callback) {
   var cursor = db.collection('restaurants').find( );
   cursor.each(function(err, doc) {
      assert.equal(err, null);
      if (doc != null) {
         console.log(doc);
      } else {
         callback();
      }
   });
};

compiler = webpack(webpackConfig)

var webpackDevMidleWareInstance = webpackMiddleware(compiler, {
  quiet: false,
  stats: {
    colors: true
  },
  publicPath: webpackConfig.output.publicPath
});
app.use(webpackDevMidleWareInstance);

app.use(webpackHotMiddleware(compiler, {
    log: console.log,
}))

app.use(function(req, res, next) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    res.locals.db = db;
    next();
  });
})

app.get('/', function (req, res, next) {
  res.sendFile('./client/pages/index.html', {root: __dirname});
});

app.use(function(req, res, next) {
  res.locals.db.close();
  next();
})

app.listen(port, function () {
  console.log('Example app listening on port '+port+'!');
});
