var
	mongoClient = require('mongodb').MongoClient,
	objectId = require('mongodb').ObjectID;
	url = 'mongodb://localhost:27017/blog_test',
	app_db = require('../app_db'),
	should = require('should');

app_db.synopsis_length = 10;
app_db.url = url;

describe('app_db test', function () {
	var entry1Id, entry2Id, entry3Id, entry4Id, entry5Id;

	beforeEach(function (done) {
		entry1Id = objectId();
		entry2Id = objectId();
		entry3Id = objectId();
		entry4Id = objectId();
		entry5Id = objectId();

		mongoClient.connect(url, function (err, db) {
			db.collection('entries').insert([
				{ _id : entry1Id, title : 'Entry 1', posted : new Date(2014, 10, 26), content: '1234567890-1234567890-1234567890-1234567890-1234567890' },
				{ _id : entry2Id, title : 'Entry 2', posted : new Date(2014, 10, 01), content: '9876543210-9876543210-9876543210-9876543210-9876543210-9876543210-9876543210' },
				{ _id : entry3Id, title : 'Entry 3', posted : new Date(2014, 09, 20), content: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' },
				{ _id : entry4Id, title : 'Entry 4', posted : new Date(2014, 03, 10), content: 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb' },
				{ _id : entry5Id, title : 'Entry 5', posted : new Date(2013, 10, 08), content: 'ccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc' }
			], done);
		});
	});

	it('get entries earlier than date and limit', function (done) {
		app_db.get_entries(new Date(2014, 10, 01), 2, function (entries) {
			entries.length.should.equal(2);
			entries[0].should.have.properties({
				title : 'Entry 3',
				posted : new Date(2014, 09, 20),
				synopsis : 'aaaaaaaaaa' 
			});
			entries[1].should.have.properties({
				title : 'Entry 4',
				posted : new Date(2014, 03, 10),
				synopsis : 'bbbbbbbbbb'
			});
			done();
		});
	});

	xit('get entry by id', function (done) {
		app_db.get_entry(entry1Id, function ( entry ) {
			entry.should.have.properties({
				title : 'Entry 1',
				posted : new Date(2014, 10, 26),
				content : '1234567890-1234567890-1234567890-1234567890-1234567890'
			});
			done();
		});
	});

	xit('post entry', function (done) {
		var entry = { title : 'Inserted Entry', posted : new Date(2014, 10, 30), content : 'A test entry was inserted' };
		app_db.post_entry( entry  , function ( entryId ) {
			mongoClient.connect(url, function (err, db) {
				db.collection('entries').findOne( { _id : { $eq : entryId } }).toArray( function (err, entries) {
					entries.length.should.equal(1);
					entries[0].should.properties({
						title : 'Inserted Entry', 
						posted : new Date(2014, 10, 30),
						content : 'A test entry was inserted'
					});
					done();
				});
			});
		});
	});

	afterEach(function (done) {
		mongoClient.connect(url, function (err, db) {
			db.collection('entries').remove();
			done();
		});
	});
});