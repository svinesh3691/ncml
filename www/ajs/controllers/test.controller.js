// Procurement Controllers
app.controller('tests', ['$scope','fns','seven','$stateParams', '$rootScope',
    function ( $scope , fns , seven , $stateParams , $rootScope) {
        $scope.id = $stateParams.Id; 
        


        fns.query('SELECT * FROM Test WHERE ProcurementId = ?',[$scope.id],function(res){
            // console.log(res.result.rows.length);
                // console.log(JSON.parse(res.result.rows.item(0).Damaged));
                $scope.tests = JSON.parse(res.result.rows.item(0).Damaged);
                $scope.$apply();
                
        });

      
         $rootScope.addTests = function(){
            window.location = '#/app/tests_add/'+$scope.id;

         }

         $rootScope.testUpdate = function(){
                console.log($scope.tests);
                seven.showPreloader('Updating..');
                fns.query('UPDATE Test SET Damaged = ?  WHERE ProcurementId = ?',[JSON.stringify($scope.tests), $scope.id],function(res){
                    seven.hidePreloader();
                    seven.alert('Saved Successfully')
                    // window.location.href = '#/app/tests/'+$scope.id;
                });
        }
}]);




app.controller('tests_add', ['$scope','fns','seven','$stateParams', '$rootScope',
    function ( $scope , fns , seven , $stateParams , $rootScope) {
        $scope.id = $stateParams.Id; 
        
        $scope.tests = [];

        fns.query('SELECT * FROM Test WHERE ProcurementId = ?',[$scope.id],function(res){
            // console.log(res.result.rows.length);
                // console.log(JSON.parse(res.result.rows.item(0).Damaged));
                $scope.tests = JSON.parse(res.result.rows.item(0).Damaged);
                $scope.$apply();
                
        });

       

         $rootScope.addTests = function(){
            window.location = '#/app/tests_add/'+$scope.id;

         }

         $rootScope.test_add_Update = function() {
                // console.log(JSON.stringify($scope.tests));
                seven.showPreloader('Updating..');
                fns.query('UPDATE Test SET Damaged = ?  WHERE ProcurementId = ?',[JSON.stringify($scope.tests), $scope.id],function(res){
                    // console.log(res);
                 
                    seven.hidePreloader();
                    seven.alert('Saved Successfully')
                    window.location.href = '#/app/tests/'+$scope.id;
                });
        }
}]);




