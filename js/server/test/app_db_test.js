var app_db = require('../app_db'),
	should = require('should'),
	dac = app_db();

describe('app_db test', function () {
	var entryIds;

	before(function (done){
		dac.initialize(done);
	});

	beforeEach(function (done) {
		var getCallback,
			noOfInserted = 0;

		getCallback = function (IdNo) {
			entryIds = {};

			return function (entry) {
				entryIds[IdNo] = entry._id;
				if (++noOfInserted == 5) {
					done();
				};
			};
		};

		dac.postEntry( { title : 'Entry 1', posted : new Date(2014, 10, 26), content: '1234567890-1234567890-1234567890-1234567890-1234567890' }, getCallback('id1') );
		dac.postEntry( { title : 'Entry 2', posted : new Date(2014, 10, 01), content: '9876543210-9876543210-9876543210-9876543210-9876543210-9876543210-9876543210' }, getCallback('id2') );
		dac.postEntry( { title : 'Entry 3', posted : new Date(2014, 09, 20), content: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' }, getCallback('id3') );
		dac.postEntry( { title : 'Entry 4', posted : new Date(2014, 03, 10), content: 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb' }, getCallback('id4') );
		dac.postEntry( { title : 'Entry 5', posted : new Date(2013, 10, 08), content: 'ccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc' }, getCallback('id5') );
	});

	describe('getEntries', function () {
		it('return limit no of records', function (done) {
			dac.getEntries(new Date(2014, 10, 01), 2, function (entries) {
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
			dac.getEntries(new Date(2014, 03, 10), 2, function (entries) {
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
			dac.getEntries(new Date(2013, 10, 08), 2, function (entries) {
				entries.length.should.equal(0);
				done();
			});
		});
	});

	describe('getEntry', function () {
		it('get ok', function (done) {
			dac.getEntry(entryIds['id1'], function (entry) {
				entry.should.have.properties({
					title : 'Entry 1',
					posted : new Date(2014, 10, 26),
					content : '1234567890-1234567890-1234567890-1234567890-1234567890' 
				});
				done();
			});
		});

		it('get not ok', function (done) {
			dac.getEntry('xxxxxxxxx', function (entry) {
				(entry == null).should.be.true;
				done();
			});
		});
	});

	describe('postEntry', function () {
		it('post ok', function (done) {
			dac.postEntry(
				{ title : 'Entry 1', posted : new Date(2014, 10, 26), content: '1234567890-1234567890-1234567890-1234567890-1234567890' },
				function (entry) { 
					entry.title.should.equal('Entry 1');
					done(); 
				}
			);
		});
	});

	describe('deleteEntry', function () {
		it('delete ok', function (done) {
			dac.deleteEntry(entryIds['id1'], function () {
				dac.getEntry(entryIds['id1'], function (entry) {
					(entry == null).should.be.true;
					done();
				});
			});
		});
	});

	afterEach(function (done) {
		dac.cleanUpForTesting(done);
	});
});