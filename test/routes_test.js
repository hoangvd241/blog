var routes = require('../routes'),
	request = require('supertest'),
	express = require('express'),
	should = require('should'),
	bodyParser = require('body-parser'),
	blog, app;

app = express();
app.use(bodyParser.json());

blog = {};

routes.configAnonymousRoutes(app, blog);
routes.configAdminRoutes(app, blog);

describe('routes test', function () {
	describe('blog/list', function () {
		it('ok', function (done) {
			blog.getEntries = function (year, month, date, limit, callback) {
				callback(null, { year : year, month : month, date : date, limit : limit });
			};
			request(app).get('/blog/list').query({ year : 2007, month : 11, date: 1, limit : 2 })
				.expect(200, { year: '2007', month : '11', date : '1', limit : '2' }, done);
		});

		it('err', function (done) {
			blog.getEntries = function (year, month, date, limit, callback) {
				callback('There is an error.', null);
			};
			request(app).get('/blog/list').expect(500).end(function (err, res) {
				res.text.should.containEql('There is an error.');
				done();
			});
		});
	});

	describe('blog/read', function () {
		it('ok', function (done) {
			blog.getEntry = function (id, callback) {
				callback(null, id);
			};
			request(app).get('/blog/read').query({ id:'123'}).expect(200).end(function (err, res) {
				res.text.should.containEql('123');
				done();
			});
		});

		it('err', function (done) {
			blog.getEntry = function (id, callback) {
				callback('There is an error', null);
			};
			request(app).get('/blog/read').expect(500).end(function (err, res) {
				res.text.should.containEql('There is an error');
				done();
			});
		});
	});

	describe('blog/create', function () {
		it('ok', function (done) {
			blog.postEntry = function (title, content, callback) {
				callback(null, { title : title, content : content });
			};
			request(app).post('/blog/create').send({ title : 'Title', content : 'Content' }).expect(200, { title : 'Title', content : 'Content'}, done);
		});

		it('err', function (done) {
			blog.postEntry = function (title, content, callback) {
				callback('There is an error', null);
			};
			request(app).post('/blog/create').send({ title : 'Title', content : 'Content' }).expect(500).end(function (err, res) {
				res.text.should.containEql('There is an error');
				done();
			});
		});
	});
});