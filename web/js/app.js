'use strict';

var app = angular.module('app', [
    'ngRoute',
    'ngCookies',
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
    }
]);

var appCtrls = angular.module('app.controllers', []);