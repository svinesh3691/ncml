/*config Phase*/
app.config(['$controllerProvider','$compileProvider','$filterProvider','$provide',
   function( $controllerProvider , $compileProvider , $filterProvider , $provide ) {
            // lazy controller, directive and service
            app.controller = $controllerProvider.register;
            app.directive  = $compileProvider.directive;
            app.filter     = $filterProvider.register;
            app.factory    = $provide.factory;
            app.service    = $provide.service;
            app.constant   = $provide.constant;
            app.value      = $provide.value;
        }
]);


/*Run Phase*/
app.run(['$rootScope','$state','$stateParams','seven','fns',
function( $rootScope , $state , $stateParams , seven  , fns ) {
        // console.log('Run'); 

        // Checking whether the User is authenticated and has a token
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){ 
              if((toState.name.split('.')[0] != 'authenticate') && (!localStorage.token) ){
                     delete localStorage.token;
                     window.location.href = '#/authenticate/login';
              }
        });

        // On Each state change success scroll to the top of the page
        $rootScope.$on('$stateChangeSuccess', function() {
              document.body.scrollTop = document.documentElement.scrollTop = 0;
        });

        var dbCreate = fns.createDatabase();  
        if (dbCreate) {
            // console.log('db created');
            tables = fns.createTables(dbCreate);
        }
}])
