var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var express = require('express');
var bodyParser = require('body-parser');
var webpack = require('webpack');
var webpackDevServer = require('webpack-dev-server');
var webpackConfig = require('./webpack.config');
import {findRestaurants, create2dSphereIndex, updateRestaurant, insertSeeds} from './database';

var app = express();


webpackConfig.entry.unshift("webpack-dev-server/client?http://localhost:3000/");
var compiler = webpack(webpackConfig);
var server = new webpackDevServer(compiler, {
  hot: true
});
server.listen(3000);

app.use(bodyParser.json()); // for parsing application/json
app.use('/pages', express.static(__dirname + '/client/pages')); //declare static path

var url = 'mongodb://localhost:27017/test';

var port = process.env.PORT || 8080;

app.use(function(req, res, next) {
  MongoClient.connect(url, function(err, db) {
    if(err) throw err
    create2dSphereIndex(db);
    res.locals.db = db;
    next();
  });
})

app.get('/', function(req, res, next) {
  res.sendFile('./client/pages/index.html', {
    root: __dirname
  });
});

app.get('/seeds', function (req, res) {
  insertSeeds(req.locals.db);
})

app.route('/api/restaurant')
  .get(function(req, res, next) {
    //get only one restaruant
  })
  .post(function(req, res, next) {
    //add a restaurant
  })
  .put(function(req, res) {
    updateRestaurant(res.locals.db, req.body.restaurant).then(function(docs, err) {
      if(err) res.send(err);
      res.send(docs);
    })
  })
  .delete(function(req, res) {
    //delete a restaurant
  })

app.route('/api/restaurants')
  .get(function(req, res) {
    findRestaurants(res.locals.db, req.query).then(function(docs, err) {
      if (err) res.send(err);
      res.send(docs);
    });
    //get all restaurants
  })
  .delete(function(req, res) {
    //delete all restaurant
  })

app.use(function(req, res, next) {
  res.locals.db.close();
  next();
})

app.listen(port, function() {
  console.log('Example app listening on port ' + port + '!');
});
