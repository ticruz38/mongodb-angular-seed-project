myApp.service('ApiService', function ($http) {
  this.getRestaurants = (onSuccess) => {
    $http.get('/api/restaurants').then(onSuccess, (err) => {
      console.log(err);
      return err;
    });
  }
});
