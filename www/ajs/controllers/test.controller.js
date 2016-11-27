// Test Controllers
app.controller('tests', ['$scope','fns','seven','$stateParams', '$rootScope',
    function ( $scope , fns , seven , $stateParams , $rootScope) {

        $scope.pro = {};
        var already_started;
        $scope.id = $stateParams.Id; 
        // var sample_cats = JSON.parse(localStorage.ncml_raw_data_lab);
        var sample_items  = JSON.parse(localStorage.ncml_sample_items);


        fns.query('SELECT * FROM Procurement WHERE ProcurementId = ?',[$scope.id],function(res){
                var i = 0;
                JsonContent = JSON.parse(res.result.rows.item(i).JsonContent);
                JsonContent.ProcurementId = res.result.rows.item(i).ProcurementId;
                procurement_data = JsonContent;

                if(res.result.rows.item(i).Test_CompDate && res.result.rows.item(i).Test_CompDate !=0.0) $scope.pro.completed    =  true;
                if(res.result.rows.item(i).Test_StartDate != '') already_started    =  res.result.rows.item(i).Test_StartDate;
                else already_started = false;
                $scope.pro.remarks      = res.result.rows.item(i).Test_Remarks;

                $scope.tests =  sample_items[procurement_data.SampleItem_Id].ItemTests;
             
                for(i in $scope.tests) {
                     $scope.tests[i].TestMethod[0] = {'Method_Name':'--Select test method--','Method_ID':''};
                }

                fns.query('SELECT * FROM Test WHERE ProcurementId = ?',[$scope.id],function(res){
                        $scope.tests_data = JSON.parse(res.result.rows.item(0).TestsJson);

                        for(var kk in $scope.tests_data) {
                            if($scope.tests_data[kk].Method_ID) {
                                    if(!$scope.tests_data[kk].Method_Limit)  $scope.tests_data[kk].Method_Limit = $scope.tests[kk]['TestMethod'][$scope.tests_data[kk].Method_ID]['Method_Limit']; 
                                    if(!$scope.tests_data[kk].Method_Req)  $scope.tests_data[kk].Method_Req = $scope.tests[kk]['TestMethod'][$scope.tests_data[kk].Method_ID]['Method_Req']; 
                                    if(!$scope.tests_data[kk].Method_Unit)  $scope.tests_data[kk].Method_Unit = $scope.tests[kk]['TestMethod'][$scope.tests_data[kk].Method_ID]['Method_Unit']; 
                            }
                        }

                        $scope.$apply();
                        seven.hidePreloader();
                });
           
                
        });



      
         $rootScope.addTests = function(){
            window.location = '#/app/tests_add/'+$scope.id;

         }

         $rootScope.testUpdate = function(){
                var completed = 0;
                if($scope.pro.completed) completed = new Date();
                if(!already_started) already_started = new Date();
                seven.showPreloader('Updating..');

                fns.query('UPDATE Test SET TestsJson = ? , Status = ? WHERE ProcurementId = ?',[JSON.stringify($scope.tests_data), 2, $scope.id],function(res){
                    fns.query('UPDATE Procurement SET Test_StartDate = ? ,  Test_CompDate = ? , Test_Remarks = ? WHERE ProcurementId = ?',[already_started, completed, $scope.pro.remarks, $scope.id],function(res){
                        seven.hidePreloader();
                        seven.alert('Saved Successfully');
                        // window.location.href = '#/app/tests/'+$scope.id;
                    });
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
                fns.query('SELECT * FROM Test WHERE ProcurementId = ?',[$scope.id],function(res){
                        $scope.tests_data = JSON.parse(res.result.rows.item(0).TestsJson);
                        console.log($scope.tests_data);
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

