var db_handle = require('../dbhandle'),
	should = require('should');

describe('dbhandle test', function () {
	var entryIds;

	before(function (done){
		db_handle.initialize(done);
	});

	beforeEach(function (done) {
		var getCallback,
			noOfInserted = 0;

		getCallback = function (IdNo) {
			entryIds = {};

			return function (err, entry) {
				entryIds[IdNo] = entry._id;
				if (++noOfInserted == 5) {
					done();
				};
			};
		};

		db_handle.postEntry( { title : 'Entry 1', posted : new Date(2014, 10, 26), content: '1234567890-1234567890-1234567890-1234567890-1234567890' }, getCallback('id1') );
		db_handle.postEntry( { title : 'Entry 2', posted : new Date(2014, 10, 01), content: '9876543210-9876543210-9876543210-9876543210-9876543210-9876543210-9876543210' }, getCallback('id2') );
		db_handle.postEntry( { title : 'Entry 3', posted : new Date(2014, 09, 20), content: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' }, getCallback('id3') );
		db_handle.postEntry( { title : 'Entry 4', posted : new Date(2014, 03, 10), content: 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb' }, getCallback('id4') );
		db_handle.postEntry( { title : 'Entry 5', posted : new Date(2013, 10, 08), content: 'ccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc' }, getCallback('id5') );
	});

	describe('getEntries', function () {
		it('return limit no of records', function (done) {
			db_handle.getEntries(new Date(2014, 10, 01), 2, function (err, entries) {
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

		it('return <limit no of records', function (done) {
			db_handle.getEntries(new Date(2014, 03, 10), 2, function (err, entries) {
				entries.length.should.equal(1);
				entries[0].should.have.properties({
					title : 'Entry 5',
					posted : new Date(2013, 10, 08),
					synopsis : 'cccccccccc' 
				});
				done();
			});
		});

		it('return 0 no of records', function (done) {
			db_handle.getEntries(new Date(2013, 10, 08), 2, function (err, entries) {
				entries.length.should.equal(0);
				done();
			});
		});
	});

	describe('getEntry', function () {
		it('get ok', function (done) {
			db_handle.getEntry(entryIds['id1'], function (err, entry) {
				entry.should.have.properties({
					title : 'Entry 1',
					posted : new Date(2014, 10, 26),
					content : '1234567890-1234567890-1234567890-1234567890-1234567890' 
				});
				done();
			});
		});

		it('get not ok', function (done) {
			db_handle.getEntry('xxxxxxxxx', function (err, entry) {
				(entry == null).should.be.true;
				done();
			});
		});
	});

	describe('postEntry', function () {
		it('post ok', function (done) {
			db_handle.postEntry(
				{ title : 'Entry 1', posted : new Date(2014, 10, 26), content: '1234567890-1234567890-1234567890-1234567890-1234567890' },
				function (err, entry) { 
					entry.should.have.properties({
						title : 'Entry 1',
						posted : new Date(2014, 10, 26),
						content : '1234567890-1234567890-1234567890-1234567890-1234567890' 
					});
					done(); 
				}
			);
		});
	});

	describe('deleteEntry', function () {
		it('delete ok', function (done) {
			db_handle.deleteEntry(entryIds['id1'], function () {
				db_handle.getEntry(entryIds['id1'], function (err, entry) {
					(entry == null).should.be.true;
					done();
				});
			});
		});
	});

	afterEach(function (done) {
		db_handle.cleanUpForTesting(done);
	});
});