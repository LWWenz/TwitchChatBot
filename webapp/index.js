angular.module('myApp', []).controller('WebAppController', ['$scope', ($scope) => {
    window._scope = $scope;
    $scope.checkText = () => {
        console.log("checkText is called!");
        // $scope.name = $scope.name.toLower();
    }
}]);