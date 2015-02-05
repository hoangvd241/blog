blog.data = (function () {
	'use strict'
	var initModule, getEntries, getEntry, deleteEntry, postEntry;

	getEntries = function (year, month, date, limit) {
		return $.getJSON('/blog/list', { year: year, month: month, date: date, limit: limit});
	};

	getEntry = function (id) {
		return $.getJSON('/blog/read', { id : id });
	};

	deleteEntry = function (id) {
		return $.getJSON('/blog/delete', { id : id });
	};

	postEntry = function (title, content) {
		return $.post('/blog/create', { title : title, content : content});
	};

	initModule = function () {};

	return {
		initModule : initModule,
		getEntries : getEntries,
		getEntry : getEntry,
		deleteEntry : deleteEntry,
		postEntry : postEntry
	};
}());