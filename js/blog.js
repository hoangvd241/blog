var blog = (function () {
	'use strict';

	var
		configMap = {
			no_of_entries_per_load : 5,

			blog_model : null
		},
		stateMap = {
			$append_target : null,
			earliestEntryPosted : null
		};


	var initModule = function ( $append_target ) {
		stateMap.$append_target = $append_target;
		earliestEntryPosted = new Date();
	};

	var loadMoreEntries = function () {
		var entries = configMap.blog_model.entries.load(stateMap.earliestEntryPosted, configMap.no_of_entries_per_load);
		var i;
		for (i = 0; i < entries.length; i++) {
			var html
		}

	};

	return { 
		initModule : initModule,
		loadMoreEntries : loadMoreEntries 
	};
} ());