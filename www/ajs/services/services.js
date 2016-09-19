app.service("fns", ['$http','C', function( $http , C ) {
    this.db = {};
    // Creating the database
    this.createDatabase = function() { 
		    	try {
				    if (!window.openDatabase) {
				        alert('Database not supported');
				    } else {
					 	this.db = openDatabase(C.db.Name, C.db.Version, C.db.DisplayName, C.db.MaxSize);
				    }
				    return true
				} catch(e) {
				    if (e == 2) {
				        alert("Invalid database version.");
				    } else {
				        alert("Unknown error "+e+".");
				    }
				    return false;
				}
	}
    // Creating the table
	this.createTables   = function() {
			// this.db.transaction(function(tx){
			// 	   			tx.executeSql( 'DROP TABLE Procurement');
			// 	   			tx.executeSql( 'DROP TABLE Test');
			// 	   			console.log('Drop');
			// });
			var procurement_main 	= 'CREATE TABLE IF NOT EXISTS Procurement (ProcurementId INTEGER PRIMARY KEY AUTOINCREMENT, JsonContent TEXT, ServerId int)';
			this.query(procurement_main,[],function(res){
				// console.log(res);
			});

			var procurement_imgs 	= 'CREATE TABLE IF NOT EXISTS Procurement_Images (ProcureImgId INTEGER PRIMARY KEY AUTOINCREMENT, ProcureId int, ImageUrl TEXT, ServerId int)';
			this.query(procurement_imgs,[],function(res){
				// console.log(res);
			});

			var procurement_test 	= 'CREATE TABLE IF NOT EXISTS Test (TestId INTEGER PRIMARY KEY AUTOINCREMENT, ProcurementId INTEGER, TestsJson TEXT)';
			this.query(procurement_test,[],function(res){
				// console.log(res);
			});
	}
	//Querying the db
	this.query  = function(query,parameters,callback) {
			this.db.transaction(function(tx){
	   			tx.executeSql(  query, parameters,
								function(tx,result){
									callback({ 'code'  : 1, 'tx'    : tx, 'result': result });
								},
								function(error){
									callback({ 'code'  : 2, 'error' : error });
								});
			},
			function(error){
				alert("Error processing SQL:"+error.code);
				alert("Error processing SQL:"+error.message);
			},
			function(success){
			 		// console.log('success');
			});
	}
}]);

