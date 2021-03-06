'use strict';
angular.module('myApp')
.directive('simpleNavbar', function () {
    return {
        restrict: 'E',
        templateUrl: 'navbar/navbar.html',
        controller: function($scope, $location) {
            $scope.isActive = function(path){
                var currentPath = $location.path().split('/')[1];
                if (currentPath.indexOf('?') !== -1) {
                    currentPath = currentPath.split('?')[0];
                }
                return currentPath === path.split('/')[1];
            };
        },
    };
});