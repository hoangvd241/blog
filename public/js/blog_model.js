blog.model = (function () {
	'use strict'
	var initModule, data, getEntries, getEntry, deleteEntry, postEntry;

	data = blog.data;

	getEntries = function (year, month, date, limit) {
		return data.getEntries(year, month, date, limit);
	};
	getEntry = function (id) {
		return data.getEntry(id);
	};
	deleteEntry = function (id) {
		return data.deleteEntry(id);
	};
	postEntry = function (title, content) {
		return data.postEntry(title, content);
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