var app = angular.module('employeeManagement');

app.controller('SignupController', function($scope, $http, $location) {
    $scope.submitSignup = function() {
        var newCompany = {
            companyname: $scope.companyname.toLowerCase(),
            displayname: $scope.displayname,
            password: $scope.password 
        };

        $http.post('api/companys', newCompany).then(function() {
            alert('success');
            $location.path('/');
        }, function() {
            alert('invalid');
        });
    }

    $scope.cancel = function() {
        $location.path('/');
    };
});