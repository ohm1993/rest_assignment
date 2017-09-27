'use strict';

angular.module('myApp.view2', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/search', {
        templateUrl: 'view2/view2.html',
        controller: 'View2Ctrl'
    });
}])

.controller('View2Ctrl', function(resturent_service, $scope, $filter) {
    $scope.allItems;
    var reload = function() {
        resturent_service.getallUsers().then(function(data) {
            $scope.resturentList = data;
            $scope.filteredList = data;
            $scope.totalItems = $scope.filteredList.length;
        });
    }
    reload();
    // init the filtered items
    //$scope.filteredList = $scope.resturentList ;
    $scope.search = function() {
        $scope.filteredList = _.filter($scope.resturentList,
            function(item) {
                console.log("item value is", item);
                return searchUtil(item, $scope.query);
            });
        if ($scope.query == '') {
            $scope.filteredList = $scope.resturentList;
        }
    };
    // functions have been describe process the data for display
    function searchUtil(item, toSearch) {
            /* Search Text using resturent name and email id */
            return (item.restname.toLowerCase().indexOf(toSearch.toLowerCase()) > -1 || item.restcusinies[0].toLowerCase().indexOf(toSearch.toLowerCase()) > -1 || item.restcusinies[1].toLowerCase().indexOf(toSearch.toLowerCase()) > -1) ? true : false;
        }
        // $scope.totalItems = $scope.filteredList.length;
    $scope.currentPage = 1;
    $scope.numPerPage = 5;
    $scope.paginate = function(value) {
        var begin, end, index;
        begin = ($scope.currentPage - 1) * $scope.numPerPage;
        end = begin + $scope.numPerPage;
        index = $scope.filteredList.indexOf(value);
        return (begin <= index && index < end);
    };
});
