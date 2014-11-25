var 
	http = require('http'),
	express = require('express'),
	errorHandler = require('errorhandler'),
	logger = require('morgan'),
	mongoClient = require('mongodb').MongoClient,
	url = 'mongodb://localhost:27017/blog',
	app = express(),
	server = http.createServer( app );

app.use( logger() );
app.use( errorHandler({
	dumpExceptions : true,
	showStack : true
}));

app.get('/user', function (request, response) {
	response.contentType( 'json' );
	response.send( { title : 'Hello' } );
});

app.get('/entries/:year/:month/:date/:limit', function (request, response) {
	mongoClient.connect(url, function (outer_err, db) {
		if (outer_err)
		{
			console.log('there is error');
		}

		var year = request.params.year,
			month = request.params.month - 1,
			date = request.params.date,
			limit = parseInt(request.params.limit);
		console.log(limit);

		db.collection('entries')
			.find( { posted : { $lt : new Date(year, month, date) } } )
			.sort( { posted : -1 } )
			.limit( limit )
			.toArray(function (inner_err, entries) {
				db.close();
				response.send(entries);
		});
	});
});

server.listen(3000);

