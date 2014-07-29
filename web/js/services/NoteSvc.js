'use strict';

angular.module('app.services', ['ngResource']).
factory('NoteSvc', ['$resource',
	function($resource) {
		var headers = {'Authorization': '85e4a615f62c711d3aac0e7def5b4903'};
		return $resource('http://localhost:8888/notes/:id', {id: '@id'}, {
			query: { method: 'GET', headers: headers, isArray: true },
			get: { method: 'GET', headers: headers },
			post: { method: 'POST', headers: headers },
			put: { method: 'PUT', headers: headers },
			delete: { method: 'DELETE', headers: headers }
		});
	}
]);