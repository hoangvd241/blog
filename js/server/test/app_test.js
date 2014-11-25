var
	request = require('supertest'),
	app = require('../blog_db'),
	should = require('should'),
	mongoClient = require('mongodb').MongoClient,
	url = 'mongodb://localhost:27017/blog_test';

describe('blog api test', function() {
	it('should return 2', function (done) {
		request(app)
			.get('/entries/2014/11/20/2')
			.expect(200)
	});
});
