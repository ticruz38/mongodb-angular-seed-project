var ObjectId = require('mongodb').ObjectID;

export function insertDocument() {
  db.collection('restaurants').insertOne({
    "address": {
      "street": "2 Avenue",
      "zipcode": "10075",
      "building": "1480",
      "coord": [-73.9557413, 40.7720266]
    },
    "borough": "Manhattan",
    "cuisine": "Italian",
    "grades": [{
      "date": new Date("2014-10-01T00:00:00Z"),
      "grade": "A",
      "score": 11
    }, {
      "date": new Date("2014-01-16T00:00:00Z"),
      "grade": "B",
      "score": 17
    }],
    "name": "Vella",
    "restaurant_id": "41704620"
  }, function(err, result) {
    assert.equal(err, null);
    console.log("Inserted a document into the restaurants collection.");
    callback();
  });
};

export function insertSeeds(db) {
  http.get({host: 'https://raw.githubusercontent.com', path: '/mongodb/docs-assets/primer-dataset/primer-dataset.json'}, function(res) {
    console.log('get a response', res);
    db.collection('restaurants').insertMany(res, function(err, response) {
      if(err) return err;
      return response;
    })
  }).on('error', function() {
    console.log(e);
  });
}

export function updateRestaurant(db, restaurant) {
  var id = restaurant._id;
  delete restaurant._id;
  var p = new Promise(function(res, rej) {
    db.collection('restaurants').updateOne({
      "_id": ObjectId(id)
    }, {$set: restaurant}, function(err, result) {
      if(err) rej(err);
      res(result);
    })
  });
  return p;
}

export function findRestaurants(db, query) {
  var p = new Promise(function(res, rej) {
    var cursor;
    if (query.sort) {
      switch (query.sort) {
        case 'distance':
          //order by distance: nothing here yet
          console.log('sort', query.sort);
          cursor = db.collection('restaurants').find({
            'address.coord': {
              $near: {
                $geometry: {
                  type: "Point",
                  coordinates: [-73.9667, 40.78]
                },
                $maxDistance: 1000
              }
            }
          }).limit(parseInt(query.count));
          break;
        case 'grade':
          //nothing here yet
        default:
          //nothing here
      }
    } else if (query.query) {
      console.log(JSON.parse(query.query));
      cursor = db.collection('restaurants').find(JSON.parse(query.query)).limit(parseInt(query.count));
    } else {
      cursor = db.collection('restaurants').find().limit(parseInt(query.count));
    }
    cursor.toArray(function(err, documents) {
      if (err) rej(err);
      res(documents);
    });
  });
  return p;
};

export function create2dSphereIndex(db) {
  // Get the restaurants collection
  var collection = db.collection('restaurants');
  // Create the index
  collection.createIndex({
    'address.coord': "2dsphere"
  });
}
