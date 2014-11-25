var
	mongoClient = require('mongodb').MongoClient,
	url = 'mongodb://localhost:27017/blog';

exports.get_entries = function (earlierThanDate, limit, callback) {
	mongoClient.connect(url, function (outer_err, db) {
		db.collection('entries')
			.find( { posted : { $lt : earlierThanDate } } )
			.sort( { posted : -1 } )
			.limit( limit )
			.toArray(function (inner_err, entries) {
				db.close();
				callback(entries);
			});
	});
};