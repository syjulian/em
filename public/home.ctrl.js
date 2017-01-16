var app = angular.module('employeeManagement');

app.controller('HomeController', function($rootScope, $scope, $http, $cookies) {
    $scope.login = function() {
        $http.post('api/login', {companyname: $scope.companyname,
                                    password: $scope.password})
            .then(function(res) {
                // save token and logged in companyname as cookie on success
                $cookies.put('token', res.data.token);
                $cookies.put('currentCompany', $scope.companyname);
                $rootScope.token = res.data.token;
                $rootScope.currentCompany = $scope.companyname;
            }, function(err) {
                alert("Incorrect Login Credentials");
            });
    }
    $scope.logout = function() {
        // remove token and logged in companyanme
        $cookies.remove('token');
        $cookies.remove('currentCompany');
        $rootScope.token = null;
        $rootScope.currentCompany = null;
        resetHome();
    };

    var resetHome = function() {
        // reset some states in home view
        $scope.isFormMode = false;
        $scope.isEdit = false;
        $scope.isOwner = false;
        $scope.employees = [];
        $scope.selectedCompany = {};
        $scope.search = {};
    };

    $scope.currentEmployee = {};

    $scope.submitEmployee = function() {
        var employee  = $scope.currentEmployee;
        var compname = $scope.currentCompany;

        // Update employee if editing existing employee
        if(employee._id) {
            $http.put('api/companys/' + compname + '/employees/' + employee._id,
                      employee,
                      {headers: {authorization: $rootScope.token}})
                .then(function(res) {
                    $scope.onToggleForm({});
                    getEmployees();
            });            
        }
        // Create employee if new 
        else {
            $http.post('api/companys/' + compname + '/employees',
                       employee,
                       {headers: {authorization: $rootScope.token}})
                .then(function(res) {
                    $scope.onToggleForm({});
                    getEmployees();
                });
        }

    };

    $scope.removeEmployee = function(employee) {
        $http.delete(
            'api/companys/' + $scope.currentCompany + 
            '/employees/' + employee._id,
            {headers: {authorization: $rootScope.token}})
                .then(function() {
            getEmployees();
        });
    };

    var getEmployees = function(){
        $scope.employees = [];
        var companyname = $scope.selectedCompany.companyname;
        $http.get('api/companys/' + companyname + '/employees',
                  {headers: {authorization: $rootScope.token}}).then(function(res) {
            $scope.employees = res.data;
            console.log(res.data);
        });
    };

    // used to populate company select
    $scope.getCompanys = function() {
        $http.get('api/companys',
                  {headers: {authorization: $rootScope.token}}).then(function(res) {
            $scope.companys = res.data;
        });
    }

    // toggles between company select and employee form. also sets current employee
    $scope.onToggleForm = function(employee) {
        $scope.currentEmployee = employee;
        $scope.isFormMode = !$scope.isFormMode;
    }

    // updates selected company. pulls employees from company
    // also updates if selected company name matches logged in company name
    $scope.onSelectCompany = function() {
        if(!$scope.selectedCompany) {
            return;
        }
        getEmployees();
        $scope.isOwner = $scope.selectedCompany.companyname === $rootScope.currentCompany;
    };
});