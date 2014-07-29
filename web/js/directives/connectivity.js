'use strict';

/* Directives */

angular.module('app.directives', []).
directive('connectivity', function ($window, $parse) {
	return function (scope, element, attrs) {
		var events = scope.$eval(attrs.connectivity);
		angular.forEach(events, function(connEvent, eventName) {
			var fn = $parse(connEvent);
			switch (eventName) {
				case 'connect':
					scope.connect = fn;
					$window.addEventListener('online', function() {
						scope.$apply(function(scope) {
							fn(scope);
						});
					}, false);
				case 'disconnect':
					scope.disconnect = fn;
					$window.addEventListener('offline', function() {
						scope.$apply(function(scope) {
							fn(scope);
						});
					}, false);
			}
		});
		if (navigator.onLine) {
			scope.connect(scope);
		}
		else {
			scope.disconnect(scope);
		}
	}
}); 