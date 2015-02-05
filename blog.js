'use strict'

var initialize, getEntries, getEntry, postEntry, deleteEntry, _dbhandle;

initialize = function (dbhandle) {
	_dbhandle = dbhandle;
}

getEntries = function (year, month, date, limit, callback) {
	var
		earlierThanDate = new Date(year, month, date),
		limit = parseInt(limit);
	if (isNaN(limit)) return callback(new Error('Limit is not valid.'));
	if (isNaN(earlierThanDate.getTime())) return callback(new Error('Date is not valid.'));
	_dbhandle.getEntries(earlierThanDate, limit, callback);
}

getEntry = function (entryId, callback) {
	_dbhandle.getEntry(entryId, callback);
}

deleteEntry = function (entryId, onError) {
	_dbhandle.deleteEntry(entryId, onError);
}

postEntry = function (title, content, callback) {
	if (!title || title === '') return callback(new Error('Title is not valid.'));
	if (!content || content === '') return callback(new Error('Content is not valid.'));
	var entry = {
		title : title,
		content : content,
		posted : new Date()
	};
	_dbhandle.postEntry(entry, callback);
}

module.exports = {
	initialize : initialize,
	getEntries : getEntries,
	getEntry : getEntry,
	deleteEntry : deleteEntry,
	postEntry : postEntry
};
