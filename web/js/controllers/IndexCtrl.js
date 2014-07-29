'use strict';

appCtrls.
controller('IndexCtrl', ['$scope', 'NoteSvc', '$cookieStore', '$filter', 
	function ($scope, NoteSvc, $cookieStore, $filter) {
		if ($cookieStore.get('notes') == null) {
			$cookieStore.put('notes', []);
		}

		$scope.flash = {message: null};

		$scope.list = function() {
			if ($scope.connectivity.status) {
				console.log($scope.connectivity.text);
				var notes = [];
				NoteSvc.query().$promise.then(function(response) {
					angular.forEach(response, function(value, key) {
						this.push(value);
					}, notes);
					$scope.notes = notes;
					$cookieStore.put('notes', notes);
				});
			}
			else {
				console.log($scope.connectivity.text);
				$scope.notes = $cookieStore.get('notes');
			}
		}
		$scope.note = {};
		$scope.save = function() {
			if ($scope.note.hasOwnProperty('id')) {
				if ($scope.connectivity.status) {
					NoteSvc.put($scope.note).$promise.then(function(response) {
						console.log(response);
						$scope.flash.message = response.message;
					},
					function(error) {
						console.log(error);
					});
				}
				else {
					var notes = $cookieStore.get('notes');
					angular.forEach(notes, function(value, key) {
						if (value.id == $scope.note.id) {
							this[key] = $scope.note;
							this[key].updated = $filter('date')(Date.now(), 'yyyy-MM-dd HH:mm:ss');
							this[key].off = 'update';
						}
					}, notes);
					$cookieStore.put('notes', notes);
					$scope.flash.message = 'Nota alterada localmente com sucesso. Clique no botão sincronizar quando estiver online';
				}
			}
			else {
				if ($scope.connectivity.status) {
					NoteSvc.post($scope.note).$promise.then(function(response) {
						console.log(response);
						$scope.flash.message = response.message;
					},
					function(error) {
						console.log(error);
					});
				}
				else {
					var note = $scope.note;
					note.id = '?';
					note.updated = $filter('date')(Date.now(), 'yyyy-MM-dd HH:mm:ss');
					note.off = 'insert';
					var notes = $cookieStore.get('notes');
					notes.push(note);
					$cookieStore.put('notes', notes);
					$scope.flash.message = 'Nota cadastrada localmente com sucesso. Clique no botão sincronizar quando estiver online';
				}
			}
			$scope.list();
			$scope.note = {};
		}
		$scope.sync = function() {
			if ($scope.connectivity.status) {
				var notes = $cookieStore.get('notes');
				angular.forEach(notes, function(value, key) {
					if (value.hasOwnProperty('off')) {
						switch(value.off) {
							case 'insert': {
								delete value.id;
								NoteSvc.post(value);
								break;
							}
							case 'update': {
								NoteSvc.put(value);
								break;
							}
							case 'delete': {
								NoteSvc.delete({id: value.id});
								break;
							}
						}
					}
				}, notes);
				$scope.list();
				console.log('Sincronizado');
				$scope.flash.message = 'Dados sincronizados com com sucesso.';
			}
			else {
				console.log($scope.connectivity.text);
				$scope.notification.message = 'Não podemos sincronizar os dados enquanto estivermos offline.';
			}
		}

		$scope.update = function(id) {
			$scope.note = NoteSvc.get({id: id});
		}
		$scope.delete = function(id) {
			if ($scope.connectivity.status) {
				NoteSvc.delete({id: id}).$promise.then(function(response) {
					$scope.flash.message = response.message;
					$scope.list();
				},
				function(error) {
					console.log(error);
				});
			}
			else {
				var notes = $cookieStore.get('notes');
				angular.forEach(notes, function(value, key) {
					if (value.id == id) {
						this[key].off = 'delete';
					}
				}, notes);
				$cookieStore.put('notes', notes);
				$scope.list();
				console.log('Apagado localmente');
			}
		}
	}
]);