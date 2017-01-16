var app = angular.module('employeeManagement',
                         ['ngRoute',
                          'ngCookies',
                          'ngMaterial',
                          'ngAria',
                          'ngAnimate',
                          'ngMessages']);

app.config(function($routeProvider, $locationProvider, $mdThemingProvider) {
    $routeProvider.when('/', {
        templateUrl: 'home.html',
        controller: 'HomeController'
    }).when('/signup', {
        templateUrl: 'signup.html',
        controller: 'SignupController'
    });
});

app.run(function($cookies, $rootScope) {
    if($cookies.get('token') && $cookies.get('currentCompany')) {
        $rootScope.token = $cookies.get('token');
        $rootScope.currentCompany = $cookies.get('currentCompany');
    }
});