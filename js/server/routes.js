'use strict'

var configRoutes;

configRoutes = function (app, blog) {
	app.get('/blog/list/:year/:month/:date/:limit', function (request, response, next) {
		var params = request.params;
		blog.getEntries(params.year, params.month, params.date, params.limit, function (err, entries) {
			if (err) return next(err);
			response.send(entries);
		});
	});

	app.get('/blog/read/:id', function (request, response, next) {
		blog.getEntry(request.params.id, function (err, entry) {
			if (err) return next(err);
			response.send(entry);
		});
	});

	app.post('/blog/create' , function (request, response, next) {
		var postData = request.body;
		blog.postEntry(postData.title, postData.content, function (err, entry) {
			if (err) return next(err);
			response.send(entry);
		});
	});

	app.get('/blog/delete/:id', function (request, response) {
		dbHandle.deleteEntry(request.params.id, function (err) {
			if (err) return next(err);
		});
	});
};

module.exports = { configRoutes : configRoutes };