var
	mongoClient = require('mongodb').MongoClient;

exports.url = 'mongodb://localhost:27017/blog';
exports.synopsis_length = 144;

exports.get_entries = function (earlierThanDate, limit, callback) {
	mongoClient.connect(exports.url, function (outer_err, db) {
		db.collection('entries').aggregate([
			{ $match : { posted : { $lt : earlierThanDate } } },
			{ $sort : { posted : -1 } },
			{ $limit : limit },
			{ $project : {
				title : 1,
				posted : 1,
				synopsis : { $substr : [ '$content', 0, exports.synopsis_length ] }
			} }
		]).toArray(function (inner_err, entries) {
			db.close();
			callback(entries);
		});
	});
};