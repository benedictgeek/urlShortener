const mongodb = require('mongodb');

const mongoClient = mongodb.MongoClient;

let _db;
exports.mongoConnect = () => {
    mongoClient.connect('mongodb://localhost:27017/shortener').then( (client) => {
        _db = client.db();
    }).catch(err => {
        console.log('Technical error');
    })
}

exports.getDb = () => {
    if(_db) {
        return _db;
    }
    console.log('No DB found');
}
