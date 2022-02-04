angular.module('myApp', []).controller('WebAppController', ($scope, $interval, $http) => {
    window._scope = $scope;

    //Init
    var source = new EventSource('/event');
    $scope.connectionStatus = false;
    $scope.users = [];

    $scope.checkText = () => {
        console.log("checkText is called!");
        // $scope.name = $scope.name.toLower();
        $http.get('http://localhost:4000/GetUser', {}).then((res) => {
            $scope.name = res.data;
        });
    };

    $scope.toggleConnection = () => {
        // $scope.connectionStatus = !$scope.connectionStatus;
        $http.get('http://localhost:4000/ToggleConnection?isConnected='+$scope.connectionStatus.toString(), {}).then((res) => {
        });
    };

    var handleCallback = (res) => {
        var data = JSON.parse(res.data);
        console.log(data);
        switch(data.id){
            case 'botConnected':
                onBotStatusChanged(true);
                break;
            case 'botDisconnected':
                onBotStatusChanged(false);
                break;
            default:
                break;
        }
        // $scope.alertFromTwitch
    };

    const onBotStatusChanged = (status) => {
        console.log('onBotStatusChanged called: ', status);
        $scope.connectionStatus = status;
        $scope.$apply();
    }

    source.addEventListener('message', handleCallback, false);
});