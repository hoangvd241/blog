var
	mongoClient = require('mongodb').MongoClient,
	url = 'mongodb://localhost:27017/blog_test',
	app_db = require('../app_db'),
	should = require('should');

app_db.synopsis_length = 10;

describe('app_db test', function () {
	beforeEach(function () {
		mongoClient.connect(url, function (err, db) {
			db.collection('entries').remove();
			db.collection('entries').insert([
				{ title : 'Entry 1', posted : new Date(2014, 10, 26), content: '1234567890-1234567890-1234567890-1234567890-1234567890' },
				{ title : 'Entry 2', posted : new Date(2014, 10, 01), content: '9876543210-9876543210-9876543210-9876543210-9876543210-9876543210-9876543210' },
				{ title : 'Entry 3', posted : new Date(2014, 09, 20), content: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' },
				{ title : 'Entry 3', posted : new Date(2014, 03, 10), content: 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb' },
				{ title : 'Entry 3', posted : new Date(2013, 10, 08), content: 'ccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc' }
			]);
		});
	});

	it('get entries earlier than date and limit', function () {
		app_db.get_entries(new Date(2014, 10, 27), 2, function (entries) {
			entries.length.should.eql(2);
		})
	});
});