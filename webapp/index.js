angular.module('myApp', []).controller('WebAppController', ($scope, $interval, $http) => {
    window._scope = $scope;

    //Init
    var source = new EventSource('/event');

    $scope.checkText = () => {
        console.log("checkText is called!");
        // $scope.name = $scope.name.toLower();
        $http.get('http://localhost:4000/GetUser', {}).then((res) => {
            $scope.$apply(function () {
                $scope.name = res.data;
            });
        });
    }

    var handleCallback = (res) => {
        var data = JSON.parse(res.data);
        console.log(data);
        // $scope.alertFromTwitch
    };

    source.addEventListener('message', handleCallback, false);
});