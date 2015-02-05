var blog = (function () {
	'use strict'

	var initModule = function ($container) {
		blog.data.initModule();
		blog.model.initModule();
		blog.shell.initModule($container);
	}

	return { initModule : initModule }
} ());