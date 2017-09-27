'use strict';
// Declare app level module which depends on views, and components
var myApp = angular.module('myApp', [
  'ngRoute',
  'myApp.view1',
  'myApp.view2',
  'myApp.version',
  'ngSanitize',
  'ui.select',
  'firebase',
  'angularUtils.directives.dirPagination',
  'ui.bootstrap',
  'ngResource',
  'ngFileUpload',
  'angularFileUpload',
  'ngAnimate',
  'toastr'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/add'});
}]);
myApp.factory('resturent_service',function($rootScope,$http, $q, $firebaseObject,$firebaseArray){
    var dataService = {};
    dataService.getallUsers = function(){
          var defer = $q.defer();
          var all_users = [];
          var allusers =  firebase.database().ref().child('resturent_db').orderByKey();
          allusers.once('value',function(snapshot){
                   angular.forEach(snapshot.val(),function(value,key){
                        var obj = {
                                  "restname":value.rest_name,
                                  "restcity":value.rest_city,
                                  "restadress":value.rest_address,
                                  "restemail":value.rest_email,
                                  "restphone":value.rest_phone,
                                  "restweburl":value.rest_weburl,
                                  "base_location":value.base_location,
                                  "restcusinies":value.rest_cuisin,
                                  "resttags":value.rest_tags
                                  };
                         all_users.push(obj);
                   });
                   defer.resolve(all_users);
          });
          return defer.promise;
    };
    return dataService;
});

