'use strict';

appCtrls.
controller('appCtrl', function ($scope, $window) {
    $scope.onConnect = function() {
        var notes = localStorage.getItem('notes');
        notes = JSON.parse(notes);
        //var notes = $cookieStore.get('notes');
        var updates = 0;
        angular.forEach(notes, function(value, key) {
            if (value.hasOwnProperty('off')) {
                updates++;
            };
        }, notes);
        if (updates > 0) {
            $scope.notification.message = 'Estamos online e temos '+updates+' atualizações, clique em sincronizar';
        };
        $scope.connectivity = {
            status: true,
            class: 'label label-success',
            text: 'Online'
        };
        $scope.$broadcast('connect', $scope.connectivity);
    };
    $scope.onDisconnect = function() {
        $scope.notification.message = null;
        $scope.connectivity = {
            status: false,
            class: 'label label-danger',
            text: 'Offline'
        };
    };
    $scope.notification = { message: null };
    var appCache = $window.applicationCache;
    $scope.updateApp = function() {
        appCache.update();
        appCache.addEventListener('updateready', function(e) {
            if (appCache.status == 4) {
                appCache.swapCache();
                $window.location.reload();
            }
        }, false);
        appCache.addEventListener('noupdate', function(e) {
            $scope.notification.message = 'Nenhuma atualização disponível';
            $scope.$apply();
        }, false);
    };
});