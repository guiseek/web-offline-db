'use strict';

angular.module('app.services', ['ngResource']).
factory('NoteSvc', ['$resource',
	function($resource) {
		return $resource('http://localhost:8888/notes/:id', {id: '@id'}, {
			query: { method: 'GET', isArray: true },
			get: { method: 'GET' },
			post: { method: 'POST' },
			put: { method: 'PUT' },
			delete: { method: 'DELETE' }
		});
	}
]);