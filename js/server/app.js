var 
	http = require('http'),
	express = require('express'),
	errorHandler = require('errorhandler'),
	logger = require('morgan'),
	app = express(),
	server = http.createServer( app ),
	blog_db = require('./app_db');

app.use( logger() );
app.use( errorHandler({
	dumpExceptions : true,
	showStack : true
}));

blog_db.synopsis_length = 20;

app.get('/entries/:year/:month/:date/:limit', function (request, response) {
	var
		earlierThanDate = new Date(request.params.year, request.params.month -1, request.params.date),
		limit = parseInt(request.params.limit);
		
	blog_db.get_entries(earlierThanDate, limit, function (entries) {
		response.send(entries);
	});
});

exports.app = app;

server.listen(3000);

