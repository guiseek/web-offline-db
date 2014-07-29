'use strict';

appCtrls.
controller('appCtrl', function ($scope, $window) {
    $scope.onConnect = function() {
        $scope.connectivity = {
            status: true,
            class: 'label label-success',
            text: 'Online'
        };
    };
    $scope.onDisconnect = function() {
        $scope.connectivity = {
            status: false,
            class: 'label label-danger',
            text: 'Offline'
        };
    };
    $scope.notification = {message: null};
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