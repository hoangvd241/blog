blog.shell = (function () {
	'use strict'

	var 
		configMap = {
			noOfEntriesPerLoad : 5
		},
		stateMap = {
			earliestPosted : undefined,
			$container : undefined
		},
		model = blog.model,
		initModule, loadEntries, loadEntry, onhashchanged; 

	function dateToString(date) {
		return date.getFullYear() + ',' + date.getMonth() + ',' + date.getDate();
	};

	onhashchanged = function () {
		if (location.hash.indexOf('#getEntry') == 0) {
			var id = location.hash.substring(9);
			loadEntry(id);
		}
		else if (location.hash.indexOf('#getEntries') == 0) {
			var yearMonthDate = location.hash.substring(11).split(',');
			loadEntries(yearMonthDate[0], yearMonthDate[1], yearMonthDate[2]);
		}
	};

	initModule = function ($container) {
		stateMap.$container = $container;
	};

	loadEntries = function (year, month, date) {

		model.getEntries(year, month, date, configMap.noOfEntriesPerLoad).done(function (entries) {
				var i, html, lastEntryPosted;
				
				html = String();
				for (i=0; i < entries.length; i++) {
					var entry = entries[i];
					var posted = new Date(entry.posted);
					html += '<div class="blog-entry">'
								+ '<div class="blog-entry-time">'
									+ '<span>posted on</span>'
									+ '<time>' + posted.getDate() + '/' + (posted.getMonth() + 1) + '/' + (posted.getYear()) + '</time>'
								+ '</div>'
								+ '<h3 class="blog-entry-title">'
									+ '<a href="#getEntry' + entry._id + '">' + entry.title + '</a>'
								+ '</h3>'
								+ '<div class="blog-entry-summary">'
									+ entry.synopsis
								+ '</div>'
							+ '</div>';
				};

				if (entries.length > 0) {
					stateMap.earliestPosted = new Date(entries[entries.length - 1]);
				};

				if (entries.length == configMap.noOfEntriesPerLoad) {
					html += '<a href="#more">More</a>';
				};
				
				stateMap.$container.append(html);
		});
	};

	loadEntry = function (id) {
		model.getEntry(id).done(function (entry) {
			var html, posted;
			posted = new Date(entry.posted);
			html = String() + '<div class="blog-entry">'
								+ '<h1>' + entry.title + '</h1>'
								+ '<div class="blog-entry-time">'
									+ '<span>posted on</span>'
									+ '<time>' + posted.getDate() + '/' + (posted.getMonth() + 1) + '/' + (posted.getYear()) + '</time>'
								+ '</div>'
								+ '<div class="blog-entry-summary">'
									+ entry.content
								+ '</div>'
							+ '</div>';
			stateMap.$container.html(html);
		});
	};

	$(window).bind('hashchange', onhashchanged);
	$(document).ready(function() {
		if (!location.hash) {
			location.hash += '#getEntries' + dateToString(new Date());
		}
		else {
			onhashchanged();
		}
	});

	return {
		initModule : initModule
	};
}());