import angular from 'angular';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/js/dropdown';
import 'bootstrap/js/modal';
import '../../stylesheets/index.scss';

var myApp = angular.module('myApp' , []);

myApp.run(function ($rootScope, ApiService) {
  $rootScope.restaurantsCount = 20;
  $rootScope.query = {};
  //initialize bootstrap modal
  $('#modal').modal({
    show: false
  });
  ApiService.getRestaurants();
})
myApp.controller('IndexController', function($rootScope, $scope, ApiService) {
  this.loadMoreRestaurants = () => {
    console.log('moreRestaurants');
    $rootScope.restaurantsCount += 10;
    ApiService.getRestaurants();
  }
  this.sortBy = (sort) => {
    $scope.sort = sort;
    ApiService.getRestaurants({query: $scope.query});
  }
  this.borough = (borough) => {
    $rootScope.query.borough = borough;
    ApiService.getRestaurants();
  }
  this.cuisine = (cuisine) => {
    $rootScope.query.cuisine = cuisine;
    ApiService.getRestaurants();
  }
  this.showModal = (restaurant) => {
    $scope.restaurant = restaurant;
    $('#modal').modal('show');
  }
  this.updateRestaurant = () => {
    console.log('updateRestaurant', $scope.restaurant);
    ApiService.updateRestaurant($scope.restaurant);
  }
  this.deleteRestaurant = (id) => {
    console.log(id);
  }
});

myApp.service('ApiService', function ($http, $rootScope) {
  var self =  this;
  this.getRestaurants = (data, onSuccess) => {
    console.log(data);
    $http.get('/api/restaurants', {params: {count: $rootScope.restaurantsCount, query: $rootScope.query, ...data}}).then(onSuccess || function(res) {$rootScope.restaurants = res.data}, (err) => {
      console.log(err);
      return err;
    });
  }
  this.updateRestaurant = (restaurant, onSuccess) => {
    console.log('apiService:updateRestaurant', restaurant)
    $http.put('/api/restaurant', {restaurant: restaurant}).then(onSuccess || function(res) {self.getRestaurants}, err => err);
  }
});

window.myApp = myApp;
