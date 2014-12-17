var 
	http = require('http'),
	express = require('express'),
	errorHandler = require('errorhandler'),
	logger = require('morgan'),
	app = express(),
	server = http.createServer( app ),
	app_db = require('./app_db'),
	dac = app_db();

dac.configure({ 
	synopsis_length : 144,
	url : 'mongodb://localhost:27017/blog'
});

app.use( logger() );
app.use( errorHandler({
	dumpExceptions : true,
	showStack : true
}));

app.get('/entries/:year/:month/:date/:limit', function (request, response) {
	var
		earlierThanDate = new Date(request.params.year, request.params.month - 1, request.params.date),
		limit = parseInt(request.params.limit);
		
	dac.getEntries(earlierThanDate, limit, function (entries) {
		response.send(entries);
	});
});

app.get('/entry/:id', function (request, response) {
	var id = request.params.id;
	dac.getEntry
});

exports.app = app;

dac.initialize(function () {
	server.listen(3000);
});
