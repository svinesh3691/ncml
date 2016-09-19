// Test Controllers
app.controller('tests', ['$scope','fns','seven','$stateParams', '$rootScope',
    function ( $scope , fns , seven , $stateParams , $rootScope) {
        $scope.id = $stateParams.Id; 
        


        fns.query('SELECT * FROM Test WHERE ProcurementId = ?',[$scope.id],function(res){
            // console.log(res.result.rows.length);
                // console.log(JSON.parse(res.result.rows.item(0).TestsJson));
                $scope.tests = JSON.parse(res.result.rows.item(0).TestsJson);
                $scope.$apply();
                
        });

      
         $rootScope.addTests = function(){
            window.location = '#/app/tests_add/'+$scope.id;

         }

         $rootScope.testUpdate = function(){
                console.log($scope.tests);
                seven.showPreloader('Updating..');
                fns.query('UPDATE Test SET TestsJson = ?  WHERE ProcurementId = ?',[JSON.stringify($scope.tests), $scope.id],function(res){
                    seven.hidePreloader();
                    seven.alert('Saved Successfully')
                    // window.location.href = '#/app/tests/'+$scope.id;
                });
        }
}]);


app.controller('tests_add', ['$scope','fns','seven','$stateParams', '$rootScope',
    function ( $scope , fns , seven , $stateParams , $rootScope) {
        
        seven.showPreloader('Loading..');

        $scope.id = $stateParams.Id; 
        
        if (localStorage.ncml_now_add_pr && (localStorage.ncml_now_add_pr == localStorage.ncml_now_add_id)) {
           $scope.newP = true;
        } else {
           $scope.newP = false;
        }


        $scope.tests = [];

        fns.query('SELECT * FROM Test WHERE ProcurementId = ?',[$scope.id],function(res){
                $scope.tests = JSON.parse(res.result.rows.item(0).TestsJson);
                console.log($scope.tests);
                $scope.tests.map(function(ob){
                    ob.TestMethod.unshift({'Method_Name':'--Select test method--','Method_ID':''});
                    console.log(ob.TestMethod);
                })
                $scope.$apply();
                seven.hidePreloader();
        });



        $rootScope.test_add_Update = function() {
                seven.showPreloader('Updating..');
                localStorage.ncml_now_add_pr = 0;


                $scope.tests.map(function(ob){
                    console.log(ob)
                    if (!ob.added) {
                        ob.test_val = '';
                        ob.tesmet = '';
                    }
                    ob.TestMethod.shift();
                })



                fns.query('UPDATE Test SET TestsJson = ?  WHERE ProcurementId = ?',[JSON.stringify($scope.tests), $scope.id],function(res){
                    seven.hidePreloader();
                    seven.alert('Updated Successfully');
                    if ($scope.newP) {
                        window.location.href = '#/app/detail_procurement/'+$scope.id;
                    } else {
                        window.location.href = '#/app/tests/'+$scope.id;
                    }
                });
        }
}]);

