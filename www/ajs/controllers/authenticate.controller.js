// Login controller
app.controller('login', ['$scope','fns','seven','$state','services',
    function ( $scope , fns , seven , $state , services) {
        if(localStorage.token) $state.go('app.home');
        $scope.data = {};

        $scope.data.imei = localStorage.imei || device.uuid+'#'+device.version
        alert($scope.data.imei);


        $scope.data.username = 'admin';
        $scope.data.password = 'password';
        $scope.data.password = 'password';
        $scope.signIn = function(){
            seven.showIndicator();
            if($scope.data.username == 'admin' && $scope.data.password == 'password'){
                    localStorage.token = 'admin';
                    setTimeout(function(){
                        $state.go('app.home');
                    },2000)
            } else {
                seven.hideIndicator();
                seven.alert('Wrong Username/Password');
            }

            // services.master('',$scope.data).then(function(){

            // });
        }
}]);

// App Controller
app.controller('app', ['$scope','seven','$state',
    function ( $scope, seven, $state ) {
            seven.hideIndicator();
            // Logout Function
            $scope.logout = function() {
                    seven.showIndicator();
                    setTimeout(function(){
                        delete localStorage.token;
                        seven.hideIndicator();
                        window.location.href = '#/authenticate/login';
                    },1000)
            }
            // Go back function
            $scope.goBack = function() {
                window.history.go(-1);
            }

}]);

// Home Controller
app.controller('home', ['$scope','fns','seven','$state',
    function ( $scope , fns , seven , $state ) {
            seven.hideIndicator();
}]);



