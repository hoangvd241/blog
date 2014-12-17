var	mongodb = require('mongodb'),
	env = process.env.NODE_ENV || 'global',
	cfg = require('./config/config.' + env),

	initialize, getEntries, getEntry, postEntry, deleteEntry, cleanUpForTesting;

initialize = function (callback) {
	var url = cfg.mongo.uri + cfg.mongo.db;
	mongodb.MongoClient.connect(url , function (err, db) {
		if (err) throw err;
		entriesCollection = db.collection('entries');
		if (callback) callback();
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
	]).toArray(function (err, entries) {
		if (err) throw err;
		callback(entries);
	});
};

getEntry = function (entryId, callback) {
	entriesCollection.findOne( { _id : entryId } , {}, function (err, entry) {
		if (err) throw err;
		callback(entry);
	});	
};

deleteEntry = function (entryId, callback) {
	entriesCollection.deleteOne( { _id : entryId }, {}, function (err, entry) {
		if (err) throw err;
		if (callback) {
			callback();
		}
	});
};

postEntry = function (entry, callback) {
	entriesCollection.insertOne(entry, function (err, r) {
		if (err) throw err;
		var entry = r.ops && r.ops.length > 0 ? r.ops[0] : null;
		if (callback) {
			callback(entry);
		}
	});
};

cleanUpForTesting = function (done) {
	entriesCollection.remove( {}, { w: 1 }, function (err, noOfRemovedRecords) {
		done();
	});
};

module.exports = function () {
	var result = {
		initialize : initialize,
		getEntries : getEntries,
		getEntry : getEntry,
		postEntry : postEntry,
		deleteEntry : deleteEntry
	};

	if (process.env.NODE_ENV === 'test') {
		result.cleanUpForTesting = cleanUpForTesting;
	};

	return result;
};