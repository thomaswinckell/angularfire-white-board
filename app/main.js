var app = angular.module("app", ["ui.router", "firebase"]);

app.config(function($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.otherwise("/whiteBoard");

	$stateProvider
		.state('root', {
			abstract: true,
			template: "<div ui-view></div>"
		})
		.state('root.login', {
			url: "/login",
			templateUrl: "app/view/login.html",
			controller: "LoginController"
		})
		.state('root.whiteBoard', {
			url: "/whiteBoard",
			templateUrl: "app/view/whiteBoard.html",
			controller: "WhiteBoardController"
		});
});

app.run(function ($rootScope, $state, UserService, URL_DATABASE, AUTHENTICATION) {

	$rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {

        if (AUTHENTICATION.enabled) {

            $rootScope.firebaseAuth = new FirebaseSimpleLogin(new Firebase(URL_DATABASE), function (error, user) {

                if (error) {

                    $state.go('root.login', {error : error});

                } else if (user) {

                    UserService.setCurrentUser(user);

                    if (toState.name == 'root.login')
                        $state.go('root.whiteBoard');

                } else {
                    $state.go('root.login');
                }
            });
        }
    });

});