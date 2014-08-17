app.controller('LoginController', function ($scope, AUTHENTICATION, $rootScope) {

	$scope.login = function() {

        $rootScope.firebaseAuth.login(AUTHENTICATION.loginProvider, AUTHENTICATION.options);
	};
});