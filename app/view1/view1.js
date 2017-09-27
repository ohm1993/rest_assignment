'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/add', {
        templateUrl: 'view1/view1.html',
        controller: 'View1Ctrl',
        controllerAs: 'ctrl'
    });
}])

.controller('View1Ctrl', function($scope, $rootScope, $timeout, $firebaseObject, $firebaseArray, toastr) {
    var vm = this;
    vm.disabled = undefined;
    vm.searchEnabled = undefined;
    vm.availablecusines = ['Andhra', 'Bangali', 'Bihari', 'Chinies', 'Fast Food', 'Gujrati', 'healthy Food', 'Hydrabadi', 'Indian', 'Maharashtiyan'];
    vm.tags = ['DJ', 'Live Music', 'Free Parking', 'Outdoor Seating', 'Pool Side', 'Air Condition', 'Kid friendly', 'Hookash'];
    var options = {
        types: ['(cities)'],
        componentRestrictions: {
            country: "IN"
        }
    };
    var input_city = document.getElementById('resturent_city');
    var autocomplete = new google.maps.places.Autocomplete(input_city, options);
    autocomplete.addListener('place_changed', function() {
        var place = autocomplete.getPlace();
        if (!place.geometry) {
            console.log("entered place is not suggested");
            return;
        }
        if (place.geometry.viewport) {
            //console.log("place value is",place);
            $scope.resturent_city = place.formatted_address;
            console.log("place city value is", place.formatted_address);
        }
    });
    $scope.resturent_address = " ";
    $scope.submitForm = function(isValid) {
        if (isValid) {
            var newUserKey = firebase.database().ref().child('resturent_db').push().key;
            console.log("new key value is ", newUserKey);
            var new_resturent = {
                ID: newUserKey,
                rest_name: $scope.resturent_name,
                rest_city: $scope.resturent_city,
                rest_phone: $scope.resturent_phone,
                rest_address: $scope.resturent_address,
                rest_cuisin: $scope.ctrl.multipleDemo.cusines,
                rest_tags: $scope.ctrl.multipleDemo.tags,
                rest_email: $scope.resturent_email,
                rest_weburl: $scope.resturent_website,
                createdAt: firebase.database.ServerValue.TIMESTAMP
            };
            var updates = {};
            updates['/resturent_db/' + newUserKey] = new_resturent;
            firebase.database().ref().update(updates).then(function() {
                $scope.resturent_name = " ";
                $scope.resturent_city = " ";
                $scope.resturent_phone = "";
                $scope.resturent_address = " ";
                $scope.ctrl.multipleDemo.cusines = "";
                $scope.ctrl.multipleDemo.tags = "";
                $scope.resturent_email = "";
                $scope.resturent_website = "";
                $scope.$apply();
                toastr.success('Resturent added successfully', 'Success!');
                //console.log("successfull added ");
            }).catch(function(error) {
                // console.log("error",error);
                toastr.error(error, 'Error', {
                    timeOut: 5000
                });
            });
            /***$scope.showsuccessmsg = true;
            $timeout(function() {
               $scope.showsuccessmsg = false;
            }, 5000);***/

        } else {
            toastr.error("Form Invalid", 'Error', {
                timeOut: 5000
            });
            /***console.log("form is invalid");
            $scope.errormsg = true;
            $timeout(function(){
                $scope.errormsg = false;
            });***/
        }
    }

    function initialize() {
        var mapCanvas = document.getElementById('google-maps');
        var mapOptions = {
            center: new google.maps.LatLng(12.9600040, 77.6467180),
            zoom: 12,
            mapTypeControl: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(mapCanvas, mapOptions);
        $scope.map = map;
        var marker = new google.maps.Marker({
            icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
            position: new google.maps.LatLng(12.9583064, 77.6565492),
            map: map,
            draggable: true
        });
        var input = document.getElementById('pac-input');
        var searchBox = new google.maps.places.SearchBox(input);
        map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);
        $scope.searchTextChange = function($event) {
            var map = $scope.map;
            var keycode = $event.witch || $event.keyCode;
            if (keycode === 13) {
                // console.log("place search value is ",$scope.searchtext);
                //console.log("search text value is ",document.getElementById('searchtext'));
            } else {
                var marker = new google.maps.Marker({
                    icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
                    position: {
                        lat: 12.9716,
                        lng: 77.5946
                    },
                    map: map,
                    draggable: true
                });
                var searchBox = new google.maps.places.SearchBox(document.getElementById('pac-input'));
                google.maps.event.addListener(searchBox, 'places_changed', function() {
                    var places = searchBox.getPlaces();
                    var bounds = new google.maps.LatLngBounds();
                    var i, place;
                    for (i = 0; place = places[i]; i++) {
                        bounds.extend(place.geometry.location);
                        marker.setPosition(place.geometry.location);
                        $scope.$broadcast('mylatlng', place.formatted_address);
                        $rootScope.$broadcast('mylatlng', place.formatted_address);
                        //console.log("place value is ",place);
                        $scope.resturent_address = place.formatted_address;
                    }
                    map.fitBounds(bounds);
                    map.setZoom(15);
                });
            }
        }
        $scope.$on('mylatlng', function(event, data) {
            $scope.resturent_address = data;
            $scope.$apply();
        });

    }
    $timeout(function() {
        initialize();
    }, 100);
});