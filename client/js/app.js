var angular = require('angular');

console.log('hello-worlddd');

var app = angular.module('app' , []);

app.controller('indexController', function($scope) {
  $scope.hello = 'world';
})
