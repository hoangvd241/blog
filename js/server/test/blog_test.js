var blog = require('../blog'),
	should = require('should'),
	db_handle;

db_handle = {
	getEntries : function (earlierThanDate, limit, callback) {
		callback();
	},
	getEntry : function (id, callback) {	
		callback();
	},
	deleteEntry : function (id, onError) {
		onError();
	},
	postEntry : function (entry, callback) {
		callback(null, entry);
	}
};

blog.initialize(db_handle);

describe('blog test', function (){
	describe('getEntries', function (){
		it('ok', function (done){
			blog.getEntries(2007, 12, 31, 2, function (err, entries) {
				(err == null).should.be.ok;
				done();
			});
		});

		it('limit is not valid', function (done){
			blog.getEntries(2007, 12, 31, 'a', function (err, entries) {
				err.message.should.equal('Limit is not valid.');
				done();
			});
		});

		it('date is not valid', function (done) {
			blog.getEntries(2007, 12, 'a', 2, function (err, entries) {
				err.message.should.equal('Date is not valid.');
				done();
			});
		});
	});

	describe('postEntry', function () {
		it('ok', function (done) {
			var today = new Date();
			blog.postEntry('Title', 'Content', function (err, entry) {
				(err == null).should.be.ok;
				entry.title.should.equal('Title');
				entry.content.should.equal('Content');
				entry.posted.getFullYear().should.equal(today.getFullYear());
				entry.posted.getMonth().should.equal(today.getMonth());
				entry.posted.getDate().should.equal(today.getDate());
				done();
			});
		});

		it('title is null', function (done) {
			blog.postEntry(null, 'Content', function (err, entry) {
				err.message.should.equal('Title is not valid.');
				done();
			});
		});

		it('title is empty', function (done) {
			blog.postEntry('', 'Content', function (err, entry) {
				err.message.should.equal('Title is not valid.');
				done();
			});
		});

		it('content is null', function (done) {
			blog.postEntry('Title', null, function (err, entry) {
				err.message.should.equal('Content is not valid.');
				done();
			});
		});

		it('content is empty', function (done) {
			blog.postEntry('Title', '', function (err, entry) {
				err.message.should.equal('Content is not valid.');
				done();
			});
		});
	});
});