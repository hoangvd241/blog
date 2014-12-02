var app_db = require('../app_db'),
	should = require('should'),
	dac;

process.env.NODE_ENV = 'test';

dac = app_db();

dac.configure({ 
	synopsis_length : 10,
	url : 'mongodb://localhost:27017/blog_test'
});

describe('app_db test', function () {
	before(function (done){
		dac.initialize(function (err){
			if (err) throw err;
			done();
		});
	});

	describe('getEntries test', function () {
		beforeEach(function (done) {
			var callback,
				noOfInserted = 0;

			callback = function (err, entry) {
				if (++noOfInserted == 5) {
					done();
				};
			};

			dac.postEntry( { title : 'Entry 1', posted : new Date(2014, 10, 26), content: '1234567890-1234567890-1234567890-1234567890-1234567890' }, callback );
			dac.postEntry( { title : 'Entry 2', posted : new Date(2014, 10, 01), content: '9876543210-9876543210-9876543210-9876543210-9876543210-9876543210-9876543210' }, callback );
			dac.postEntry( { title : 'Entry 3', posted : new Date(2014, 09, 20), content: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' }, callback );
			dac.postEntry( { title : 'Entry 4', posted : new Date(2014, 03, 10), content: 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb' }, callback );
			dac.postEntry( { title : 'Entry 5', posted : new Date(2013, 10, 08), content: 'ccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc' }, callback );
		});

		it('getEntries earlier than date and limit', function (done) {
			dac.getEntries(new Date(2014, 10, 01), 2, function (err, entries) {
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
	});



	/*xit('get entry by id', function (done) {
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
	});*/

	afterEach(function (done) {
		dac.cleanUpForTesting(done);
	});
});