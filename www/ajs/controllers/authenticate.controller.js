// Login controller
app.controller('login', ['$scope','fns','seven','$state','services',
    function ( $scope , fns , seven , $state , services) {
        if(localStorage.token) $state.go('app.home');
        $scope.data = {};

        //$scope.data.imei = localStorage.imei || device.uuid+'#'+device.version
        $scope.data.imei = 'test';

        $scope.data.username = 'admin';
        $scope.data.password = 'password';

        $scope.signIn = function(){
            seven.showIndicator();
            if($scope.data.username == 'admin' && $scope.data.password == 'password'){
                    localStorage.token = 'admin';

                    localStorage.Imei = '45634534456456453';
                    localStorage.User_Id = 12;
                    localStorage.Lab_Id = 36;

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
app.controller('app', ['$scope','seven','$state','services','fns',
    function ( $scope, seven, $state, services, fns ) {
            seven.hideIndicator();

            $scope.showLoadNow = function(){
                    var f7 = new Framework7({
                            modalTitle: 'Alert',
                            material: true,// Enable Material theme
                    });
                    f7.showPreloader('Loading...');

            }


            // Logout Function
            $scope.logout = function() {
                    seven.showIndicator();
                    setTimeout(function(){
                        delete localStorage.token;
                        seven.hideIndicator();
                        window.location.href = '#/authenticate/login';
                    },1000)
            }

            $scope.sync_raw_data = function() {
                    seven.showIndicator();
                    // services.master_get('new_ncml.json').then(function(res){
                    services.master_get('GetAllData?Labid=1').then(function(res){
                        
                        // Processing Registeration data
                        var Registration_data = {};
                        res.data.Registration.map(function(a){
                            Registration_data[a.Customer_ID] = a;
                        });

                        // Processing Lab Data
                        // var LabData = {};
                        // res.data.Lab.map(function(LabDataTemp){
                                
                        //         var ProductCategoryTemp = {};
                        //         LabDataTemp.ProductCategory.map(function(b){
                        //             var SampleTemp = {};
                        //             b.Sample.map(function(c){
                        //                 var SampleItemTemp = {};
                        //                 c.SampleItem.map(function(d){
                        //                     var ItemDetailsTemp = {};
                        //                     var ItemTestsTemp = {};

                        //                     d.ItemDetails.map(function(e){
                        //                         ItemDetailsTemp[e.ItemDetails_ID] = e;
                        //                     });
                        //                     d.ItemTests.map(function(e){
                        //                         var TestMethodTemp = {};
                        //                         e.TestMethod.map(function(f){
                        //                             TestMethodTemp[f.Method_ID] = f;
                        //                         });
                        //                         e.TestMethod = TestMethodTemp;
                        //                         ItemTestsTemp[e.TestID] = e;
                        //                     });
                        //                     d.ItemDetails = ItemDetailsTemp;
                        //                     d.ItemTests = ItemTestsTemp;
                        //                     SampleItemTemp[d.SampleItem_Id] = d
                        //                 });
                        //                 c.SampleItem = SampleItemTemp; 
                        //                 SampleTemp[c.Sample_ID] = c;
                        //             });
                        //             b.Sample = SampleTemp;
                        //             ProductCategoryTemp[b.ProductCategory_Id] = b;
                        //         });
                        //         LabDataTemp.ProductCategory = ProductCategoryTemp;
                        //     LabData[LabDataTemp.SampleCategory_Id] = LabDataTemp;
                        // });
                        // localStorage.ncml_raw_data_lab = JSON.stringify(LabData);

                        var SampleItemTemp = {};
                        res.data.SampleItem.map(function(d){
                            var ItemDetailsTemp = {};
                            var ItemTestsTemp = {};

                            d.ItemDetails.map(function(e){
                                ItemDetailsTemp[e.ItemDetails_ID] = e;
                            });
                            d.ItemTests.map(function(e){
                                var TestMethodTemp = {};
                                e.TestMethod.map(function(f){
                                    TestMethodTemp[f.Method_ID] = f;
                                });
                                e.TestMethod = TestMethodTemp;
                                ItemTestsTemp[e.TestID] = e;
                            });
                            d.ItemDetails = ItemDetailsTemp;
                            d.ItemTests = ItemTestsTemp;
                            SampleItemTemp[d.SampleItem_Id] = d
                        });
                        // c.SampleItem = SampleItemTemp; 

                        localStorage.ncml_sample_items       = JSON.stringify(SampleItemTemp);

                        localStorage.ncml_data_registeration = JSON.stringify(Registration_data);
                        seven.hideIndicator();

                    });
                    
            }

            // Go back function
            $scope.goBack = function() {
                window.history.go(-1);
            }




            // $scope.sync_to_server = function () {


            //     var write = function(to_send) {
            //         console.log('ok');
            //              services.master('OFC/factory/write.php',{data:to_send}).then(function(res){

            //             });
            //     }

            //     var baseIt = function (url,cb) {
            //         var xhr = new XMLHttpRequest();       
            //         xhr.open("GET", url, true); 
            //         xhr.responseType = "blob";
            //         xhr.onload = function (e) {

            //                 var reader = new FileReader();
            //                 reader.onload = function(event) {
            //                     var res = event.target.result;
            //                     cb(res);
            //                 }
            //                 var file = this.response;
            //                 reader.readAsDataURL(file)
                             
            //         };
            //         xhr.send()
            //     }

            //     fns.query('SELECT * FROM Procurement',[],function(res){
            //             window.to_send = {};
            //             var Procurements = [];
            //             for (var i = 0;k = res.result.rows.length, i< k; i++) {
            //                 var P = {};
            //                 P.JsonContent = JSON.parse(res.result.rows.item(i).JsonContent);
            //                 P.ProcurementId = res.result.rows.item(i).ProcurementId;
            //                 P.Status = res.result.rows.item(i).ProcurementId;
            //                 P.ServerId = res.result.rows.item(i).ServerId;
            //                 Procurements.push(P);
            //             }

            //             to_send.Procurements = Procurements;
            //             fns.query('SELECT * FROM Test',[],function(res){
            //                     var Tests = [];

            //                     for (var i = 0;k = res.result.rows.length, i< k; i++) {
            //                         var T = {};
            //                         T.TestsJson = JSON.parse(res.result.rows.item(i).TestsJson);
            //                         T.ProcurementId = JSON.parse(res.result.rows.item(i).ProcurementId);
            //                         T.TestId = JSON.parse(res.result.rows.item(i).TestId);
            //                         T.Status = JSON.parse(res.result.rows.item(i).Status);
            //                         T.ServerId = JSON.parse(res.result.rows.item(i).ServerId);
            //                         Tests.push(T);
            //                     }

            //                     to_send.Tests = Tests;  



            //                     fns.query('SELECT * FROM Procurement_Images',[],function(res){

            //                             var Images = [];
            //                             var cc = 0;
            //                             for (var i = 0;k = res.result.rows.length, i< k; i++) {
            //                                 var I = {};
            //                                 // image = res.result.rows.item(i)
            //                                 I.ProcureImgId = JSON.parse(res.result.rows.item(i).ProcureImgId);
            //                                 I.ProcureId = JSON.parse(res.result.rows.item(i).ProcureId);
            //                                 I.ImageUrl = res.result.rows.item(i).ImageUrl;
            //                                 I.Status = res.result.rows.item(i).Status;
            //                                 I.ServerId = res.result.rows.item(i).ServerId;

            //                                 console.log(res.result.rows.item(i).ImageUrl);
            //                                 Images.push(I);
            //                                 to_send.Images = Images; 

            //                                 baseIt(res.result.rows.item(i).ImageUrl,function(b){
            //                                          console.log(to_send);
            //                                         console.log(cc);
            //                                         console.log(to_send.Images);
            //                                         to_send.Images[cc].tt = b;
            //                                         cc++;
            //                                         if(cc == res.result.rows.length) {

            //                                             console.log('write');
            //                                             console.log(JSON.stringify(to_send.Images[0]));
            //                                             write(to_send);
            //                                         }


            //                                 })

            //                                 // var xhr = new XMLHttpRequest();       
            //                                 // xhr.open("GET", res.result.rows.item(i).ImageUrl, true); 
            //                                 // xhr.responseType = "blob";
            //                                 // xhr.onload = function (e) {
            //                                 //         var reader = new FileReader();
            //                                 //         reader.onload = function(event) {
            //                                 //            var res = event.target.result;
            //                                 //         }

            //                                 //         var file = this.response;
            //                                 //         var b = reader.readAsDataURL(file);
            //                                 //         // console.log(b);
            //                                 //         to_send.Images[cc].tt = b;
            //                                 //         cc++;

            //                                 //         if(cc == res.result.rows.length) {
            //                                 //             console.log('write');
            //                                 //             console.log(JSON.stringify(to_send.Images[0]));
            //                                 //             write(to_send);
            //                                 //         }
            //                                 // };
            //                                 // xhr.send()


            //                                                                         }

 
            //                             // console.log(to_send);
            //                             // console.log(JSON.stringify(to_send));
            //                             // services.master('OFC/factory/write.php',{data:to_send}).then(function(res){

            //                             // });
            //                     });
            //             });


            //     });
            // }
            function promise() {
                          var _pro = this;
                          var status   = false;
                          var promises  = {};
                          var promises_achieved = {};
                          var success = {};
                          var successFn = {};

                          var _check = function () {
                                for(var i in promises_achieved){
                                   if(!promises_achieved[i]) return; 
                                } 
                                status =  true;
                                if((successFn)&&(typeof(successFn) == 'function')) successFn();
                                else return console.warn('Aid Warning: No function is executed when promise is achieved');
                          }

                          _pro.add    = function (name,fn,args) {
                              promises_achieved[name] = false;
                              promises[name] = [fn,args];
                          };
                          _pro.fulfill = function (name) {
                                 promises_achieved[name] = true;
                                 if((success[name]) && (typeof(success[name]) == 'function')) success[name]();
                                 _check();
                          };
                          _pro.success = function (name,fn){
                              success[name] = fn;
                          }
                          _pro.achieved = function (fn) {
                              successFn = fn;
                              for(var i in promises) {
                                  promises[i][0].apply(null,promises[i][1]);
                              }
                          }
                          
              }

            

            $scope.sync_to_server = function () {


                    var data_to_send =  {};
                    data_to_send.procurement = [];


                    var write = function(to_send) {
                        console.log('ok');
                         services.master('OFC/factory/write.php',{data:to_send}).then(function(res){

                        });
                    }

                    var baseIt = function (url,cb,index) {
                            var xhr = new XMLHttpRequest();       
                            xhr.open("GET", url, true); 
                            xhr.responseType = "blob";
                            xhr.onload = function (e) {

                                    var reader = new FileReader();
                                    reader.onload = function(event) {
                                        var res = event.target.result;
                                        cb(res,index);
                                    }
                                    var file = this.response;
                                    reader.readAsDataURL(file)
                                     
                            };
                            xhr.send()
                    }


                     var convertImages = function(to_convert){
                            console.log('convertImages');
                            console.log(to_convert);
                            var P = new promise();
                            if(to_convert.length > 0) {
                                    to_convert.forEach(function(item,index){
                                        P.add(index,function(index){
                                            baseIt(item.ImageUrl,function(res,index){
                                                to_convert[index]['Imagebase64'] = res;
                                                P.fulfill(index);
                                            },index);
                                        },[index]);
                                    });

                                    P.achieved(function(){
                                        for (var t =0; t< to_convert.length; t++) {
                                            data_to_send.procurement[to_convert[t].p_index].ImageDetails[to_convert[t].i_index].Imagebase64 =to_convert[t].Imagebase64; 
                                        }
                                        console.log(JSON.stringify(data_to_send));
                                        write(data_to_send);
                                    });
                            } else {
                                        console.log(JSON.stringify(data_to_send));

                            }
                            
                    }


                    var processImages = function() {
                            var to_convert = [];

                                for (var kl=0;kl<data_to_send.procurement.length;kl++) {
                                        if(data_to_send.procurement[kl].ImageDetails.length > 0){
                                                    for(var lk = 0; lk < data_to_send.procurement[kl].ImageDetails.length; lk++) {
                                                        to_convert.push({
                                                           'p_index' : kl, 
                                                           'i_index' : lk,
                                                           'ImageUrl': data_to_send.procurement[kl].ImageDetails[lk].ImageUrl
                                                        });
                                                    }
                                        }                                
                                }
                            convertImages(to_convert);
                    }





                    console.log('Syncing...');
                    fns.query('SELECT * FROM Procurement',[],function(res){

             
                            for (var kl = 0;k = res.result.rows.length, kl< k; kl++) {

                                    var this_proc = {};
                                    for (var jj in res.result.rows.item(kl)) {
                                        if (jj!='JsonContent' ) {
                                            this_proc[jj] = res.result.rows.item(kl)[jj] 
                                        } else {
                                            var JsonContent = JSON.parse(res.result.rows.item(kl)[jj]);
                                            for (var mm in JsonContent) {
                                                this_proc[mm] = JsonContent[mm] 
                                            }
                                        }

                                    }
                                
                                    var this_itemdetails = [];
                                    for( var jh in this_proc.ItemDetails){
                                            this_itemdetails.push(this_proc.ItemDetails[jh])
                                    }                                
                                    this_proc.ItemDetails = this_itemdetails;
                                    fns.query('SELECT * FROM Test WHERE ProcurementId = ?',[this_proc.ProcurementId],function(res){
                                            var TestsJson = JSON.parse( res.result.rows.item(0).TestsJson);
                                            var this_testdetails = [];
                                            for( var jh in TestsJson){
                                                    this_testdetails.push(TestsJson[jh])
                                            }  
                                            this_proc.TestDetails = this_testdetails;

                                            /*Images*/
                                            fns.query('SELECT * FROM Procurement_Images  WHERE ProcureId = ?',[this_proc.ProcurementId],function(res){
                                                    var this_images = [];
                                                    for (var i = 0;k = res.result.rows.length, i< k; i++) {
                                                        var I = {};
                                                        I.Image_Id      = res.result.rows.item(i).ProcureImgId;
                                                        I.ImageUrl      = res.result.rows.item(i).ImageUrl;

                                                        this_images.push(I);
                                                    }
                                                    this_proc.ImageDetails = this_images;

                                                    data_to_send.procurement.push(this_proc);
                                                    processImages();

                                            });

                                            /*Images*/

                                            
                                    });
                                
                            }
                    });

            }


}]);

// Home Controller
app.controller('home', ['$scope','fns','seven','$state',
    function ( $scope , fns , seven , $state ) {
            seven.hideIndicator();
}]);



