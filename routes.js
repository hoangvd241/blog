'use strict'

var configAnonymousRoutes, configAdminRoutes;

configAnonymousRoutes = function (app, blog) {
	app.get('/blog/list', function (request, response, next) {
		var query = request.query;
		blog.getEntries(query.year, query.month, query.date, query.limit, function (err, entries) {
			if (err) return next(err);
			response.json(entries);
		});
	});

	app.get('/blog/read', function (request, response, next) {
		blog.getEntry(request.query.id, function (err, entry) {
			if (err) return next(err);
			response.json(entry);
		});
	});
};

configAdminRoutes = function (app, blog) {
	app.post('/blog/create' , function (request, response, next) {
		var postData = request.body;
		blog.postEntry(postData.title, postData.content, function (err, entry) {
			if (err) return next(err);
			response.json(entry);
		});
	});

	app.get('/blog/delete', function (request, response) {
		dbHandle.deleteEntry(request.query.id, function (err) {
			if (err) return next(err);
		});
	});
};

module.exports = { 
	configAnonymousRoutes : configAnonymousRoutes,
	configAdminRoutes : configAdminRoutes
};