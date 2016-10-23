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
            $scope.agencies = agencies;

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
                console.log('$scope.data')
                console.log(JSON.stringify($scope.data))

                $scope.fields = [];
                var thisSampleItem = sample_cats[$scope.data.sample_category].ProductCategory[$scope.data.product_category].Sample[$scope.data.sample].SampleItem[$scope.data.sample_item];

                for( var itemDet in thisSampleItem.ItemDetails) {
                    var sampleItemField = {
                         title: thisSampleItem.ItemDetails[itemDet].ItemDetails_Name,
                         model: 'extra_fields'+thisSampleItem.ItemDetails[itemDet].ItemDetails_ID,
                         type: 'text',
                         real_type: 'text',
                         id     : 'sample_item',
                         icon: 'icon-form-url',

                     }
                    $scope.fields.push(sampleItemField);

                }









                fns.query('SELECT * FROM Test WHERE ProcurementId = ?',[$scope.id],function(res){

                        var tests = JSON.parse(res.result.rows.item(0).TestsJson);
                        console.log(tests);
                        var tests_count = 0;
                        for (var k in tests) {
                            if(tests[k].added) tests_count++;
                        }
                   
                        $scope.tests_count = tests_count;
                        $scope.$apply();
                        list_images();
                        seven.hidePreloader();
                });
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
                }

                function onFail(message) {
                    alert('Failed because: ' + message);
                }
            }




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
            //console.log('Edit Procurement'); 

            //Tou must do raw data sync for this to work
            if(!localStorage.ncml_raw_data_lab || !localStorage.ncml_data_registeration) {
                seven.alert('Please do raw data sync to continue');
                window.location.href = '#/app/home'; 
                return;
            } else {
              var sample_cats = JSON.parse(localStorage.ncml_raw_data_lab);
              var agencies    = JSON.parse(localStorage.ncml_data_registeration);
              $scope.agencies    = agencies;
            }

            seven.showPreloader();
            $scope.id = $stateParams.Id; 
            fns.query('SELECT * FROM Procurement WHERE ProcurementId = ?',[$scope.id],function(res){
                var i = 0;
                JsonContent = JSON.parse(res.result.rows.item(i).JsonContent);
                JsonContent.ProcurementId = res.result.rows.item(i).ProcurementId;
                $scope.data = JsonContent;
                $scope.data.SamplingDate = new Date($scope.data.SamplingDate);

                 $scope.agencyName = $scope.data.client.Customer_Name;


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

                // for(var i = 0;i < thisSampleItem.ItemDetails.length; i++) {

                //     var sampleItemField = {
                //          title: thisSampleItem.ItemDetails[i].ItemDetails_Name,
                //          model: 'extra_fields'+i,
                //          type: 'text',
                //          real_type: 'text',
                //          id     : 'sample_item',
                //          icon: 'icon-form-url',

                //      }
                //     $scope.fields.push(sampleItemField);

                // }

                 for( var itemDet in thisSampleItem.ItemDetails) {
                    console.log(itemDet);
                    var sampleItemField = {
                         title: thisSampleItem.ItemDetails[itemDet].ItemDetails_Name,
                         model: 'extra_fields'+thisSampleItem.ItemDetails[itemDet].ItemDetails_ID,
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
    
            $scope.back = function(){
                    window.location = '#/app/detail_procurement/'+$scope.id;
            }
            $scope.save = function(data) {
                seven.showPreloader('Updating..');
                fns.query('UPDATE Procurement SET JsonContent = ?,  Status = ? WHERE ProcurementId = ?',[JSON.stringify(data), 2, $scope.id],function(res){
                    seven.hidePreloader();
                    seven.alert('Updated Successfully','Alert',function(){
                                window.location = '#/app/detail_procurement/'+$scope.id;
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



            /* For client filter */
            $scope.closeAgencySelect = function(){
                $('.agency-search-select').hide();
                $('.form-div').show();
            }
            $(document).on('click','.agency-select-box',function(){
                $('.agency-search-select').show();
                $('.form-div').hide();
            });
            $(document).on('click','.ag',function(){
                var cid = $(this).data('cid');;
                $scope.data.client = cid;
                $scope.agencyName = cid.Customer_Name;
                $scope.searchTextClient ='';
                $scope.$apply();
                $scope.closeAgencySelect();
            });
}]);

app.controller('add_procurement', ['$scope','fns','seven','$state',
    function ( $scope , fns , seven , $state) {
            // seven.showPreloader('Loading...');
            setTimeout(function(){
              seven.hidePreloader();
            },1789)
            //You must do raw data sync for this to work
            if(!localStorage.ncml_raw_data_lab || !localStorage.ncml_data_registeration) {
                seven.alert('Please do raw data sync to continue');
                window.location.href = '#/app/home'; 
                return;
            } else {
                var sample_cats = JSON.parse(localStorage.ncml_raw_data_lab);
                var agencies    = JSON.parse(localStorage.ncml_data_registeration);
                $scope.agencies    = agencies;
            }


            //Initializing datas
            $scope.data = {};
            $scope.data.SamplingDate = new Date();
            
            
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

            //For Save
            $scope.save = function(data) {



                if(!$scope.data.client || !$scope.data.SamplingDate || !$scope.data.FarmerName || !$scope.data.sample_category ||  !$scope.data.product_category ||  !$scope.data.sample ||  !$scope.data.sample_item){
                        seven.alert('Please enter all the values!');
                        return false;
                }
                if(!(new Date($scope.data.SamplingDate)<= new Date()))  {
                        seven.alert('The date must be equal/less than today');
                        return false;
                }
              
                seven.showPreloader('Getting Location..');



                var onSuccess = function(position) {
                      seven.hidePreloader();
                      // alert('Latitude: '          + position.coords.latitude          + '\n' +
                      //       'Longitude: '         + position.coords.longitude         + '\n' +
                      //       'Altitude: '          + position.coords.altitude          + '\n' +
                      //       'Accuracy: '          + position.coords.accuracy          + '\n' +
                      //       'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
                      //       'Heading: '           + position.coords.heading           + '\n' +
                      //       'Speed: '             + position.coords.speed             + '\n' +
                      //       'Timestamp: '         + position.timestamp                + '\n');
                      seven.showPreloader('Saving Data..');
                      data.loc = {}; 
                      data.loc.latitude = position.coords.latitude; 
                      data.loc.longitude = position.coords.longitude; 
                      fns.query('INSERT into Procurement (JsonContent,Status,ServerId) VALUES (?,?,?)',[JSON.stringify(data),1,0],function(res){
                              
                              lastInsertId = res.result.insertId;

                              var tests =  {};

               
                              fns.query('INSERT into Test (ProcurementId,TestsJson,Status,ServerId) VALUES (?,?,?,?)',[lastInsertId,JSON.stringify(tests),1,0],function(res){
                                      seven.hidePreloader();
                                      localStorage.ncml_now_add_id = lastInsertId;
                                      localStorage.ncml_now_add_pr = lastInsertId;
                                      seven.alert('Saved Successfully','Alert',function(){
                                          window.location.href = '#/app/tests_add/'+lastInsertId;
                                      })
                              });
                              
                      });

                };

                function onError(error) {
                  seven.hidePreloader();
                  seven.alert('Error getting location, Please try again.','Alert',function(){

                  })
                  // alert('code: '    + error.code    + '\n' + // 'message: ' + error.message + '\n','Testing');
                }

                navigator.geolocation.getCurrentPosition(onSuccess,onError,{timeout: 100000, enableHighAccuracy: true});


                
            }

            $scope.sample_category_selected = function() {

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
            }

            $scope.sample_product_selected = function() {
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
            }

            $scope.sample_selected = function() {
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



            }

            $scope.sample_item_selected = function() {
                $scope.fields = $scope.fields.slice(0,7);
                $scope.data.sample_item_id = sample_cats[$scope.data.sample_category].ProductCategory[$scope.data.product_category].Sample[$scope.data.sample].SampleItem[$scope.data.sample_item].SampleItem_Id;
                var thisSampleItem = sample_cats[$scope.data.sample_category].ProductCategory[$scope.data.product_category].Sample[$scope.data.sample].SampleItem[$scope.data.sample_item];


                for( var itemDet in thisSampleItem.ItemDetails) {
                    console.log(itemDet);
                    var sampleItemField = {
                         title: thisSampleItem.ItemDetails[itemDet].ItemDetails_Name,
                         model: 'extra_fields'+thisSampleItem.ItemDetails[itemDet].ItemDetails_ID,
                         type: 'text',
                         real_type: 'text',
                         id     : 'sample_item',
                         icon: 'icon-form-url',

                     }
                    $scope.fields.push(sampleItemField);

                }
            }


            /* For client filter */
            $scope.closeAgencySelect = function(){
                $('.agency-search-select').hide();
                $('.form-div').show();
            }
            $(document).on('click','.agency-select-box',function(){
                $('.form-div').hide();
                $('.agency-search-select').show();
                
            });
            $(document).on('click','.ag',function(){
                var cid = $(this).data('cid');;
                $scope.data.client = cid;
                $scope.agencyName = cid.Customer_Name;
                $scope.searchTextClient ='';
                $scope.$apply();
                $scope.closeAgencySelect();
            });
}]);




