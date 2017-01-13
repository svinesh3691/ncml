app.factory("seven", ['$http', function($http) {
	var myApp = new Framework7({
                    modalTitle: 'Alert',
                    material: true,// Enable Material theme
    });
    return myApp;   
}]);


app.factory("services", ['$http', function($http) {
    // var serviceBase = 'http://localhost/OFC/factory/pro/';
    // var serviceBase = 'http://localhost/';
    // var serviceBase = 'http://www.ncmlapi.kritilims.in/Service.asmx/';
    // var serviceBase = 'http://192.168.43.231/';
    // var serviceBase = 'http://52.172.1.50:160/Service.asmx/';
    var serviceBase = 'http://192.169.189.135:100/Service.asmx/';
    
    var obj = {};
    obj.master = function(func_name,post_data){
        return $http.post(serviceBase + func_name, post_data);
    }
    obj.master_get = function(func_name,post_data){
        return $http.get(serviceBase + func_name, post_data);
    }
    return obj;   
}]);