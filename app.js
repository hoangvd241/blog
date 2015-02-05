var path = require('path'),
	http = require('http'),
	express = require('express'),
	db_handle = require('./dbhandle'),
	blog = require('./blog'),
	routes = require('./routes'),
	anonymousApp, adminApp, anonymousServer, adminServer;

blog.initialize(db_handle);

anonymousApp = express();
anonymousApp.use(express.static(path.join(__dirname, 'public')));
routes.configAnonymousRoutes(anonymousApp, blog);
anonymousServer = http.createServer(anonymousApp);

adminApp = express();
adminApp.use(express.static('public'));
routes.configAnonymousRoutes(anonymousApp, blog);
routes.configAdminRoutes(adminApp, blog);
adminServer = http.createServer(adminApp);

db_handle.initialize(function () {
	anonymousServer.listen(3000);
	adminServer.listen(3001, 'localhost');
});
