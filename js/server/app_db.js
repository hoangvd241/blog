var initialize, get_entries, get_entry, post_entry,
	mongodb = require('mongodb'),
	entriesCollection,
	synopsis_length = 144,
	url = 'mongodb://localhost:27017/blog';

initialize = function (done) {
	mongodb.MongoClient.connect(exports.url, function (err, db) {
		if (err) throw err;
		entriesCollection = db.collection('entries');
		if (done) {
			done();
		}
	});
}

get_entries = function (earlierThanDate, limit, callback) {
	entriesCollection.aggregate([
		{ $match : { posted : { $lt : earlierThanDate } } },
		{ $sort : { posted : -1 } },
		{ $limit : limit },
		{ $project : {
			title : 1,
			posted : 1,
			synopsis : { $substr : [ '$content', 0, exports.synopsis_length ] }
		} }
	]).toArray(function (err, entries) {
		if (err) throw err;
		callback(entries);
	});
};

get_entry = function ( entryId, callback ) {
	entriesCollection.find( { _id : entryId }).toArray(function ( err, entries ) {
		var entry;
		if (err) throw err;
		entry = entries && entries.length > 0 ? entries[0] : null;
		callback(entry);
	});	
};

post_entry = function ( entry, callback ) {
	entriesCollection.insert( entry, function (err, entries) {
		if (err) throw err;
		callback(entries[0]);
	});
};

module.exports = function () {
	return {
		url : url,
		synopsis_length : synopsis_length,
		initialize : initialize,
		get_entries : get_entries,
		get_entry : get_entry,
		post_entry : post_entry
	}
}; 