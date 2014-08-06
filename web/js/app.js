'use strict';

var app = angular.module('app', [
    'ngRoute',
    'app.services',
    'app.controllers',
    'app.directives'
]);

app.config(['$routeProvider', '$httpProvider', '$locationProvider',
    function($routeProvider, $httpProvider, $locationProvider) {
        $routeProvider.
        when('/index', {
            templateUrl: 'views/index.html',
            controller: 'IndexCtrl'
        }).
        otherwise({
            redirectTo: '/index'
        });
        $httpProvider.defaults.headers.common.Authorization = '85e4a615f62c711d3aac0e7def5b4903';
    }
]);

var appCtrls = angular.module('app.controllers', []);