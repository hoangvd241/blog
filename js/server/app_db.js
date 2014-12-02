var	mongodb = require('mongodb'),
	configMap = {
		synopsis_length : 144,
		url : 'mongodb://localhost:27017/blog'
	},

	configure, initialize, getEntries, getEntry, postEntry, cleanUpForTesting;

configure = function (input_map) {
	if (input_map.url) {
		configMap.url = input_map.url;
	};
	if (input_map.synopsis_length) {
		configMap.synopsis_length = input_map.synopsis_length;
	};
	if (input_map.development) {
		configMap.development = true;
	};
}

initialize = function (callback) {
	mongodb.MongoClient.connect(configMap.url , function (err, db) {
		if (db) {
			entriesCollection = db.collection('entries');
		};
		callback(err);
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
			synopsis : { $substr : [ '$content', 0, configMap.synopsis_length ] }
		} }
	]).toArray(function (err, entries) {
		callback(err, entries);
	});
};

getEntry = function (entryId, callback) {
	entriesCollection.find({ _id : entryId }).toArray(function (err, entries) {
		var entry = entries && entries.length > 0 ? entries[0] : null;
		callback(err, entry);
	});	
};

postEntry = function (entry, callback) {
	entriesCollection.insert(entry, function (err, entries) {
		var entry = entries && entries.length > 0 ? entries[0] : null;
		if (callback) {
			callback(err, entry);
		}
	});
};

cleanUpForTesting = function (callback) {
	entriesCollection.remove(function (err, noOfRemovedRecords) {
		if (callback) callback();
	});
};

module.exports = function () {
	var result = {
		configure : configure,
		initialize : initialize,
		getEntries : getEntries,
		getEntry : getEntry,
		postEntry : postEntry
	};

	if (process.env.NODE_ENV === 'test') {
		result.cleanUpForTesting = cleanUpForTesting;
	};

	return result;
};