app.config(['$stateProvider','$urlRouterProvider',
  function(  $stateProvider , $urlRouterProvider ) {
          
          $urlRouterProvider.otherwise('app/home');
          $stateProvider
              .state('app', {
                  abstract: true,
                  url: '/app',
                  templateUrl: 'tpl/app.html',
                  controller:'app'
              })
              .state('app.home', {
                  url: '/home',
                  templateUrl: 'tpl/modules/home.html',
                  controller: 'home'
              })
              /*Authenticate*/
              .state('authenticate', {
                  abstract: true,
                  url: '/authenticate',
                  templateUrl: 'tpl/authenticate.html',
              })
              .state('authenticate.login', {
                  url: '/login',
                  templateUrl: 'tpl/modules/authenticate/login.html',
                  controller: 'login'
              })

              /*Procurement Management*/
              .state('app.add_procurement', {
                  url: '/add_procurement',
                  templateUrl: 'tpl/modules/procurement/add.html',
                  controller: 'add_procurement'
              })
              .state('app.list_procurement', {
                  url: '/list_procurement/:type',
                  templateUrl: 'tpl/modules/procurement/list2.html',
                  controller: 'list_procurement'
              })
              .state('app.detail_procurement', {
                  url: '/detail_procurement/:Id',
                  templateUrl: 'tpl/modules/procurement/detail.html',
                  controller: 'detail_procurement'
              })
              .state('app.edit_procurement', {
                  url: '/edit_procurement/:Id',
                  templateUrl: 'tpl/modules/procurement/edit.html',
                  controller: 'edit_procurement'
              })

              /*Test Management*/
              .state('app.tests', {
                  url: '/tests/:Id',
                  templateUrl: 'tpl/modules/test/page.html',
                  controller: 'tests'
              })
              .state('app.tests_temp', {
                  url: '/tests_temp',
                  templateUrl: 'tpl/modules/test/temp.html',
              })

              /*Templates*/
              .state('app.form_template', {
                  url: '/form_template',
                  templateUrl: 'tpl/templates/form.html',
              })
              .state('app.list_template', {
                  url: '/list_template',
                  templateUrl: 'tpl/templates/list.html',
              })
              .state('app.login_template', {
                  url: '/login_template',
                  templateUrl: 'tpl/templates/login.html',
              })

    }
  ]
);



