// Procurement Controllers
app.controller('tests', ['$scope','fns','seven','$stateParams', '$rootScope',
    function ( $scope , fns , seven , $stateParams , $rootScope) {
        $scope.id = $stateParams.Id; 
        fns.query('SELECT * FROM Test WHERE TestId = ?',[$scope.id],function(res){
            // console.log(JSON.stringify(res.result.rows.item(0)));
                // $scope.data = res.result.rows.item(0);
                $scope.data = {
                    TestId:res.result.rows.item(0).TestId,
                    ProcurementId:res.result.rows.item(0).ProcurementId,
                    Damaged:res.result.rows.item(0).Damaged,
                    DisColoured:res.result.rows.item(0).DisColoured,
                    ChalkyGrain:res.result.rows.item(0).ChalkyGrain,
                    RedGrains:res.result.rows.item(0).RedGrains,
                    AdMixtures:res.result.rows.item(0).AdMixtures,
                    DeHusked:res.result.rows.item(0).DeHusked,
                    Moisture:res.result.rows.item(0).Moisture,
                };
                $scope.$apply();
        });



        $rootScope.testUpdate = function(){

                seven.showPreloader('Updating..');
                fns.query('UPDATE Test SET Damaged = ? ,DisColoured = ? ,ChalkyGrain = ? ,RedGrains = ? ,AdMixtures = ? ,DeHusked = ? ,Moisture = ?   WHERE TestId = ?',[$scope.data.Damaged, $scope.data.DisColoured, $scope.data.ChalkyGrain, $scope.data.RedGrains, $scope.data.AdMixtures, $scope.data.DeHusked, $scope.data.Moisture, $scope.id],function(res){
                    seven.hidePreloader();
                    seven.alert('Saved Successfully')
                    // window.location.href = '#/app/detail_procurement/'+$scope.id;
                });
        }
}]);



