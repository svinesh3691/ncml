// Procurement Controllers
app.controller('list_procurement', ['$scope','fns','seven',
    function ( $scope , fns , seven ) {
        seven.showPreloader();

        $scope.data = [];
        $scope.loading = true; 
        fns.query('SELECT * FROM Procurement',[],function(res){
            for (var i = 0;k = res.result.rows.length, i< k; i++) {
                JsonContent = JSON.parse(res.result.rows.item(i).JsonContent);
                JsonContent.ProcurementId = res.result.rows.item(i).ProcurementId;
                $scope.data.push(JsonContent);
            }
            $scope.loading = false;
            seven.hidePreloader();
            $scope.$apply();
        });
}]);


app.controller('detail_procurement',
    ['$scope','fns','seven','$stateParams','$rootScope', '$state',
        function ($scope,fns,seven,$stateParams,$rootScope, $state) {

            //You must do raw data sync for this to work
            if(!localStorage.ncml_raw_data_lab || !localStorage.ncml_data_registeration) {
                seven.alert('Please do raw data sync to continue');
                window.location.href = '#/app/home'; 
                return;
            } else {
              var sample_cats = JSON.parse(localStorage.ncml_raw_data_lab);
              var agencies    = JSON.parse(localStorage.ncml_data_registeration);
            }

            
            seven.showPreloader();
            var image;
            $scope.images = [];
            $scope.id = $stateParams.Id;
            $scope.sample_cats = sample_cats;

            var list_images = function () {

                    fns.query('SELECT * FROM Procurement_Images WHERE ProcureId = ?',[$scope.id],function(res){
                        $scope.images = [];
                        for (var i = 0; k = res.result.rows.length , i< k; i++) {
                            image = res.result.rows.item(i);
                            $scope.images.push(image);
                        }
                        $scope.$apply();
                        seven.hidePreloader();
                    });
            }

            fns.query('SELECT * FROM Procurement WHERE ProcurementId = ?',[$scope.id],function(res){
                var i = 0;
                JsonContent = JSON.parse(res.result.rows.item(i).JsonContent);
                JsonContent.ProcurementId = res.result.rows.item(i).ProcurementId;
                $scope.data = JsonContent;
                //console.log($scope.data);
                //console.log('$scope.data.sample_category');
                //console.log($scope.data.sample_category);

                $scope.fields = [];
                var thisSampleItem = sample_cats[$scope.data.sample_category].ProductCategory[$scope.data.product_category].Sample[$scope.data.sample].SampleItem[$scope.data.sample_item];
                //console.log(thisSampleItem.ItemDetails);
                for(var i = 0;i < thisSampleItem.ItemDetails.length; i++) {

                    var sampleItemField = {
                         title: thisSampleItem.ItemDetails[i].ItemDetails_Name,
                         model: 'extra_fields'+i,
                         type: 'text',
                         real_type: 'text',
                         id     : 'sample_item',
                         icon: 'icon-form-url',

                     }
                    $scope.fields.push(sampleItemField);

                }



                $scope.$apply();
                list_images();
                seven.hidePreloader();
            });

            $rootScope.root_edit_id =  $scope.id;

            


            $rootScope.delete   = function(){
                setTimeout(function () {
                        seven.confirm('Are you sure to delete?',function(){
                                seven.showPreloader();

                                fns.query('DELETE FROM Procurement WHERE ProcurementId = ?',[$scope.id],function(res){
                                        seven.hidePreloader();
                                        seven.alert('Deleted Successfully','Alert',function(){
                                                    window.location = '#/app/list_procurement/all'
                                        });
                                });
                        });
                },100);
            }

            $rootScope.del_image   = function(img_id){
                setTimeout(function () {
                        seven.confirm('Are you sure to delete the image ?',function() {
                                seven.showPreloader();
                                fns.query('DELETE FROM Procurement_Images WHERE ProcureImgId = ?',[img_id],function(res){
                                        list_images();
                                });
                        });
                },100);
            }

            

            $scope.camera = function () {
                navigator.camera.getPicture(onSuccess, onFail, { quality: 16, 
                    destinationType: Camera.DestinationType.FILE_URI });

                function onSuccess(imageURI) {
                    fns.query('INSERT into Procurement_Images (ProcureId, ImageUrl, ServerId) VALUES (?,?,?)',[$scope.id,imageURI,0],function(res){
                        var lastInsertId = res.result.insertId;
                        list_images();
                    });
                    // movePic(imageURI);

                    // onImageSuccess(imageURI);



                }

                function onFail(message) {
                    alert('Failed because: ' + message);
                }
            }

            // LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL



                function onImageSuccess(fileURI) {
                    createFileEntry(fileURI);
                }
         
                function createFileEntry(fileURI) {
                    window.resolveLocalFileSystemURL(fileURI, copyFile, fail);
                }
         
                // 5
                function copyFile(fileEntry) {
                    var name = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
                    var newName = makeid() + name;
         
                    window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(fileSystem2) {
                        fileEntry.copyTo(
                            fileSystem2,
                            newName,
                            onCopySuccess,
                            fail
                        );
                    },
                    fail);
                }
                
                // 6
                function onCopySuccess(entry) {
                    alert(entry.nativeURL);
                    // $scope.$apply(function () {
                    //     $scope.images.push(entry.nativeURL);
                    // });
                    fns.query('INSERT into Procurement_Images (ProcureId, ImageUrl, ServerId) VALUES (?,?,?)',[$scope.id,entry.nativeURL,0],function(res){
                        var lastInsertId = res.result.insertId;
                        alert('lastInsertId');
                        alert(lastInsertId);
                        list_images();
                    });

                }
         
                function fail(error) {
                    //console.log("fail: " + error.code);
                }
         
                function makeid() {
                    var text = "";
                    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
         
                    for (var i=0; i < 5; i++) {
                        text += possible.charAt(Math.floor(Math.random() * possible.length));
                    }
                    return text;
                }


            /*QQQQQQQQQQQQQQQQQQQQQQQQQqq*/


                function movePic(file) { 
                    alert('movePic');
                    window.resolveLocalFileSystemURI(file, resolveOnSuccess, resOnError); 
                } 

                //Callback function when the file system uri has been resolved
                function resolveOnSuccess(entry){ 
                    alert('resolveOnSuccess');

                    var d = new Date();
                    var n = d.getTime();
                    //new file name
                    var newFileName = n + ".jpg";
                    var myFolderApp = "EasyPacking";

                    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSys) {      
                    //The folder is created if doesn't exist
                    fileSys.root.getDirectory( myFolderApp,
                                    {create:true, exclusive: false},
                                    function(directory) {
                                        entry.moveTo(directory, newFileName,  successMove, resOnError);
                                    },
                                    resOnError);
                                    },
                    resOnError);
                }

                //Callback function when the file has been moved successfully - inserting the complete path
                function successMove(entry) {
                    alert('successMove');
                    alert(entry.fullPath);
                    //I do my insert with "entry.fullPath" as for the path
                    fns.query('INSERT into Procurement_Images (ProcureId, ImageUrl, ServerId) VALUES (?,?,?)',[$scope.id,entry.fullPath,0],function(res){
                        var lastInsertId = res.result.insertId;
                        alert('lastInsertId');
                        alert(lastInsertId);
                        list_images();
                    });
                }

                function resOnError(error) {
                    alert(error.code);
                }
            /*QQQQQQQQQQQQQQQQQQQQQQqqqqq*/
}]);


app.controller('edit_procurement',
    ['$scope','fns','seven','$state','$stateParams',
        function ( $scope , fns , seven , $state, $stateParams) {
          // //console.log('Edit Procurement'); 

            //Tou must do raw data sync for this to work
            if(!localStorage.ncml_raw_data_lab || !localStorage.ncml_data_registeration) {
                seven.alert('Please do raw data sync to continue');
                window.location.href = '#/app/home'; 
                return;
            } else {
              var sample_cats = JSON.parse(localStorage.ncml_raw_data_lab);
              var agencies    = JSON.parse(localStorage.ncml_data_registeration);
            }

            seven.showPreloader();
            $scope.id = $stateParams.Id; 
            fns.query('SELECT * FROM Procurement WHERE ProcurementId = ?',[$scope.id],function(res){
                var i = 0;
                JsonContent = JSON.parse(res.result.rows.item(i).JsonContent);
                JsonContent.ProcurementId = res.result.rows.item(i).ProcurementId;
                $scope.data = JsonContent;
                // //console.log($scope.data);
                $scope.data.SamplingDate = new Date($scope.data.SamplingDate);
                //console.log($scope.data);


                $scope.fields = [
                     {
                         title: 'Agency/Client',
                         model: 'client',
                         type: 'select_agency',
                         icon: 'icon-form-gender',
                         options: agencies
                     },
                     {
                         title: 'Sampling date',
                         model: 'SamplingDate', 
                         type: 'text',
                         real_type: 'date',
                         maxLength: 25,
                         icon:'icon-form-calendar' 
                     },
                     {
                         title: 'Farmer name',
                         model: 'FarmerName',
                         type: 'text',
                         real_type: 'text',
                         icon: 'icon-form-name'
                     },
                     {
                         title: 'Sample Category',
                         model: 'sample_category',
                         type: 'select_sample_category',
                         icon: 'icon-form-url',
                         options: sample_cats

                     },
                     {
                           title   : 'Product Category',
                           model   : 'product_category',
                           type    : 'select_product_category',
                           icon    : 'icon-form-url',
                           options : sample_cats[$scope.data.sample_category].ProductCategory

                      },
                      {
                           title  : 'Sample',
                           model  : 'sample',
                           type   : 'select_sample',
                           icon   : 'icon-form-url',
                           options: sample_cats[$scope.data.sample_category].ProductCategory[$scope.data.product_category].Sample
                      },
                      {
                           title: 'Sample Item',
                           model: 'sample_item',
                           type: 'select_sample_item',
                           icon: 'icon-form-url',
                           options: sample_cats[$scope.data.sample_category].ProductCategory[$scope.data.product_category].Sample[$scope.data.sample].SampleItem
                      }
                ];


                var thisSampleItem = sample_cats[$scope.data.sample_category].ProductCategory[$scope.data.product_category].Sample[$scope.data.sample].SampleItem[$scope.data.sample_item];

                for(var i = 0;i < thisSampleItem.ItemDetails.length; i++) {

                    var sampleItemField = {
                         title: thisSampleItem.ItemDetails[i].ItemDetails_Name,
                         model: 'extra_fields'+i,
                         type: 'text',
                         real_type: 'text',
                         id     : 'sample_item',
                         icon: 'icon-form-url',

                     }
                    $scope.fields.push(sampleItemField);

                }
                


                $scope.$apply();
                seven.hidePreloader();
            });

            $scope.save = function(data){
                seven.showPreloader('Updating..');
                fns.query('UPDATE Procurement SET JsonContent = ?, ServerId = ?  WHERE ProcurementId = ?',[JSON.stringify(data),0,$scope.id],function(res){
                    seven.hidePreloader();
                    seven.alert('Updated Successfully','Alert',function(){
                                window.location = '#/app/list_procurement/all'
                    });
                });
            }



            $scope.sample_category_selected = function() {

                //console.log('sample_category_selected');
                $scope.fields = $scope.fields.slice(0,4);
                
                $scope.data.product_category = null;
                $scope.data.sample = null;
                $scope.data.sample_item = null;

                $scope.data.sample_category_id = sample_cats[$scope.data.sample_category].SampleCategory_Id;
                var ProductCategoryField = {
                     title   : 'Product Category',
                     model   : 'product_category',
                     type    : 'select_product_category',
                     icon    : 'icon-form-url',
                     options : sample_cats[$scope.data.sample_category].ProductCategory

                }

                $scope.fields.push(ProductCategoryField);
                    
                //console.log($scope.data);

            }


            $scope.sample_product_selected = function() {
                //console.log('sample_product_selected');
                $scope.data.sample = null;
                $scope.data.sample_item = null;
                $scope.fields = $scope.fields.slice(0,5);
                $scope.data.product_category_id = sample_cats[$scope.data.sample_category].ProductCategory[$scope.data.product_category].ProductCategory_Id;
                var sampleField = {
                     title  : 'Sample',
                     model  : 'sample',
                     type   : 'select_sample',
                     icon   : 'icon-form-url',
                     options: sample_cats[$scope.data.sample_category].ProductCategory[$scope.data.product_category].Sample
                 }
                 $scope.fields.push(sampleField);
                //console.log($scope.data);

            }


            $scope.sample_selected = function() {
                //console.log('sample_selected');
                $scope.data.sample_item = null;
                $scope.fields = $scope.fields.slice(0,6);
                $scope.data.sample_id =  sample_cats[$scope.data.sample_category].ProductCategory[$scope.data.product_category].Sample[$scope.data.sample].Sample_ID;
                var sampleItemField = {
                     title: 'Sample Item',
                     model: 'sample_item',
                     type: 'select_sample_item',
                     icon: 'icon-form-url',
                     options: sample_cats[$scope.data.sample_category].ProductCategory[$scope.data.product_category].Sample[$scope.data.sample].SampleItem
                 }
                 $scope.fields.push(sampleItemField);



                //console.log($scope.data);

            }


            $scope.sample_item_selected = function() {
                //console.log('sample_item_selected');
                $scope.fields = $scope.fields.slice(0,7);
                $scope.data.sample_item_id = sample_cats[$scope.data.sample_category].ProductCategory[$scope.data.product_category].Sample[$scope.data.sample].SampleItem[$scope.data.sample_item].SampleItem_Id;
                var thisSampleItem = sample_cats[$scope.data.sample_category].ProductCategory[$scope.data.product_category].Sample[$scope.data.sample].SampleItem[$scope.data.sample_item];

                for(var i = 0;i < thisSampleItem.ItemDetails.length; i++) {

                    var sampleItemField = {
                         title: thisSampleItem.ItemDetails[i].ItemDetails_Name,
                         model: 'extra_fields'+i,
                         type: 'text',
                         real_type: 'text',
                         id     : 'sample_item',
                         icon: 'icon-form-url',

                     }
                    $scope.fields.push(sampleItemField);

                }

                //console.log($scope.fields);
            }
}]);


app.controller('add_procurement', ['$scope','fns','seven','$state',
    function ( $scope , fns , seven , $state) {

            //You must do raw data sync for this to work
            if(!localStorage.ncml_raw_data_lab || !localStorage.ncml_data_registeration) {
                seven.alert('Please do raw data sync to continue');
                window.location.href = '#/app/home'; 
                return;
            } else {
              var sample_cats = JSON.parse(localStorage.ncml_raw_data_lab);
              var agencies    = JSON.parse(localStorage.ncml_data_registeration);
            }


            //Initializing datas
            $scope.data = {};
            $scope.data.client = '';
            $scope.data.SamplingDate = '';
            $scope.data.FarmerName = ''; 
            $scope.data.Commodity = '';
            $scope.data.sample_category = '';
            


            //Setting up the fields
            $scope.fields = [
                             {
                                 title: 'Agency/Client',
                                 model: 'client',
                                 type: 'select_agency',
                                 icon: 'icon-form-gender',
                                 options: agencies
                             },
                             {
                                 title: 'Sampling date',
                                 model: 'SamplingDate', 
                                 type: 'text',
                                 real_type: 'date',
                                 maxLength: 25,
                                 icon:'icon-form-calendar' 
                             },
                             {
                                 title: 'Farmer name',
                                 model: 'FarmerName',
                                 type: 'text',
                                 real_type: 'text',
                                 icon: 'icon-form-name'
                             },
                             {
                                 title: 'Sample Category',
                                 model: 'sample_category',
                                 type: 'select_sample_category',
                                 icon: 'icon-form-url',
                                 options: sample_cats

                             }
            ];


            // The Functions......

            //for save
            $scope.save = function(data) {
                //console.log(data);
                // if($scope.data.client == '' || $scope.data.SamplingDate == '' || $scope.data.FarmerName == '' || $scope.data.Commodity == ''){
                //         seven.alert('Please enter all the values!');
                //         return false;
                // }
                seven.showPreloader('Saving..');
                fns.query('INSERT into Procurement (JsonContent,ServerId) VALUES (?,?)',[JSON.stringify(data),0],function(res){
                    var lastInsertId = res.result.insertId;

                        var tests =  sample_cats[data.sample_category].ProductCategory[data.product_category].Sample[data.sample].SampleItem[data.sample_item].ItemTests;

                        for(var l =0;l<tests.length;l++) {
                            tests[l].added = false;
                        }



                    fns.query('INSERT into Test (ProcurementId,Damaged) VALUES (?,?)',[lastInsertId,JSON.stringify(tests)],function(res){
                            seven.hidePreloader();
                            seven.alert('Saved Successfully','Alert',function(){
                                window.location = '#/app/list_procurement/all'
                            })
                                                        
                    });
                });
            }

            $scope.sample_category_selected = function() {

                //console.log('sample_category_selected');
                $scope.fields = $scope.fields.slice(0,4);
                
                $scope.data.product_category = null;
                $scope.data.sample = null;
                $scope.data.sample_item = null;

                $scope.data.sample_category_id = sample_cats[$scope.data.sample_category].SampleCategory_Id;
                var ProductCategoryField = {
                     title   : 'Product Category',
                     model   : 'product_category',
                     type    : 'select_product_category',
                     icon    : 'icon-form-url',
                     options : sample_cats[$scope.data.sample_category].ProductCategory

                }

                $scope.fields.push(ProductCategoryField);
                    
                //console.log($scope.data);
            }

            $scope.sample_product_selected = function() {
                //console.log('sample_product_selected');
                $scope.data.sample = null;
                $scope.data.sample_item = null;
                $scope.fields = $scope.fields.slice(0,5);
                $scope.data.product_category_id = sample_cats[$scope.data.sample_category].ProductCategory[$scope.data.product_category].ProductCategory_Id;
                var sampleField = {
                     title  : 'Sample',
                     model  : 'sample',
                     type   : 'select_sample',
                     icon   : 'icon-form-url',
                     options: sample_cats[$scope.data.sample_category].ProductCategory[$scope.data.product_category].Sample
                 }
                 $scope.fields.push(sampleField);
                //console.log($scope.data);
            }

            $scope.sample_selected = function() {
                //console.log('sample_selected');
                $scope.data.sample_item = null;
                $scope.fields = $scope.fields.slice(0,6);
                $scope.data.sample_id =  sample_cats[$scope.data.sample_category].ProductCategory[$scope.data.product_category].Sample[$scope.data.sample].Sample_ID;
                var sampleItemField = {
                     title: 'Sample Item',
                     model: 'sample_item',
                     type: 'select_sample_item',
                     icon: 'icon-form-url',
                     options: sample_cats[$scope.data.sample_category].ProductCategory[$scope.data.product_category].Sample[$scope.data.sample].SampleItem
                 }
                 $scope.fields.push(sampleItemField);



                //console.log($scope.data);
            }

            $scope.sample_item_selected = function() {
                //console.log('sample_item_selected');
                $scope.fields = $scope.fields.slice(0,7);
                $scope.data.sample_item_id = sample_cats[$scope.data.sample_category].ProductCategory[$scope.data.product_category].Sample[$scope.data.sample].SampleItem[$scope.data.sample_item].SampleItem_Id;
                var thisSampleItem = sample_cats[$scope.data.sample_category].ProductCategory[$scope.data.product_category].Sample[$scope.data.sample].SampleItem[$scope.data.sample_item];

                for(var i = 0;i < thisSampleItem.ItemDetails.length; i++) {

                    var sampleItemField = {
                         title: thisSampleItem.ItemDetails[i].ItemDetails_Name,
                         model: 'extra_fields'+i,
                         type: 'text',
                         real_type: 'text',
                         id     : 'sample_item',
                         icon: 'icon-form-url',

                     }
                    $scope.fields.push(sampleItemField);

                }

                //console.log($scope.fields);
            }
}]);




