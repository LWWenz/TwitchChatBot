angular.module('myApp', []).controller('WebAppController', ($scope, $interval, $http) => {
    window._scope = $scope;
    $scope.checkText = () => {
        console.log("checkText is called!");
        // $scope.name = $scope.name.toLower();
        $http.get('http://localhost:4000/GetUser', {}).then((res) => {
            $scope.name = res.data;
        });
    }
    // Timer
});