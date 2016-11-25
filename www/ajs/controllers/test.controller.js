// Test Controllers
app.controller('tests', ['$scope','fns','seven','$stateParams', '$rootScope',
    function ( $scope , fns , seven , $stateParams , $rootScope) {
        $scope.id = $stateParams.Id; 
        // var sample_cats = JSON.parse(localStorage.ncml_raw_data_lab);
        var sample_items  = JSON.parse(localStorage.ncml_sample_items);


        fns.query('SELECT * FROM Procurement WHERE ProcurementId = ?',[$scope.id],function(res){
                var i = 0;
                JsonContent = JSON.parse(res.result.rows.item(i).JsonContent);
                JsonContent.ProcurementId = res.result.rows.item(i).ProcurementId;
                procurement_data = JsonContent;

                $scope.tests =  sample_items[procurement_data.SampleItem_Id].ItemTests;
             
                for(i in $scope.tests) {
                     $scope.tests[i].TestMethod[0] = {'Method_Name':'--Select test method--','Method_ID':''};
                }
                fns.query('SELECT * FROM Test WHERE ProcurementId = ?',[$scope.id],function(res){
                        $scope.tests_data = JSON.parse(res.result.rows.item(0).TestsJson);
                        $scope.$apply();
                        seven.hidePreloader();
                        console.log($scope.tests);

                        console.log($scope.tests_data);

                });
           
                
        });



      
         $rootScope.addTests = function(){
            window.location = '#/app/tests_add/'+$scope.id;

         }

         $rootScope.testUpdate = function(){
                console.log($scope.tests_data);
                return;
                seven.showPreloader('Updating..');
                fns.query('UPDATE Test SET TestsJson = ? , Status = ? WHERE ProcurementId = ?',[JSON.stringify($scope.tests_data), 2, $scope.id],function(res){
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

        // var sample_cats = JSON.parse(localStorage.ncml_raw_data_lab);
        var sample_items  = JSON.parse(localStorage.ncml_sample_items);

        $scope.tests = [];
        $scope.tester = {};



            fns.query('SELECT * FROM Procurement WHERE ProcurementId = ?',[$scope.id],function(res){
                var i = 0;
                JsonContent = JSON.parse(res.result.rows.item(i).JsonContent);
                JsonContent.ProcurementId = res.result.rows.item(i).ProcurementId;
                procurement_data = JsonContent;

                $scope.tests =  sample_items[procurement_data.SampleItem_Id].ItemTests;
                
             
                for(i in $scope.tests) {
                     $scope.tests[i].TestMethod[0] = {'Method_Name':'--Select test method--','Method_ID':''};
                }
                console.log($scope.tests);
                fns.query('SELECT * FROM Test WHERE ProcurementId = ?',[$scope.id],function(res){
                        $scope.tests_data = JSON.parse(res.result.rows.item(0).TestsJson);
                        $scope.$apply();
                        seven.hidePreloader();
                });
           
                
            });
        



        $rootScope.test_add_Update = function() {
                var tests_data = {};
                for(var l in $scope.tests_data){
                    if($scope.tests_data[l]['added']) tests_data[l] = $scope.tests_data[l]; 
                }
                seven.showPreloader('Updating..');
                localStorage.ncml_now_add_pr = 0;

                fns.query('UPDATE Test SET TestsJson = ?, Status = ?  WHERE ProcurementId = ?',[JSON.stringify(tests_data), 2, $scope.id],function(res){
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

