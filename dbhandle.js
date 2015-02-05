'use strict'

var	mongodb = require('mongodb'),
	ObjectID = mongodb.ObjectID,
	env = process.env.NODE_ENV || 'global',
	cfg = require('./config/config.' + env),

	entriesCollection, initialize, getEntries, getEntry, postEntry, deleteEntry, cleanUpForTesting;

initialize = function (onError) {
	var url = cfg.mongo.uri + cfg.mongo.db;
	mongodb.MongoClient.connect(url , function (err, db) {
		if (!err) { 
			entriesCollection = db.collection('entries');
		};
		if (onError) {
			onError(err);
		};
	});
}

getEntries = function (earlierThanDate, limit, callback) {
	entriesCollection.aggregate([
		{ $match : { posted : { $lt : earlierThanDate } } },
		{ $sort : { posted : -1 } },
		{ $limit : limit },
		{ $project : {
			title : 1,
			posted : 1,
			synopsis : { $substr : [ '$content', 0, cfg.synopsis_length ] }
		} }
	]).toArray(callback);
};

getEntry = function (entryId, callback) {
	entriesCollection.findOne({ _id : new ObjectID(entryId) } , {}, callback);	
};

deleteEntry = function (entryId, onError) {
	entriesCollection.deleteOne({ _id : new ObjectID(entryId) }, {}, onError);
};

postEntry = function (entry, callback) {
	entriesCollection.insertOne(entry, function (err, r) {
		var entry;
		if (!err) {
			entry = r.ops && r.ops.length > 0 ? r.ops[0] : null;
		};
		if (callback) {
			callback(err, entry);
		}
	});
};

cleanUpForTesting = function (done) {
	entriesCollection.remove( {}, { w: 1 }, function (err, noOfRemovedRecords) {
		done();
	});
};

module.exports = {
	initialize : initialize,
	getEntries : getEntries,
	getEntry : getEntry,
	postEntry : postEntry,
	deleteEntry : deleteEntry,
	cleanUpForTesting : cleanUpForTesting
};