app.controller('WhiteBoardController', function ($scope, WhiteBoardService, $document, $firebase, $timeout, UserService, $filter) {

    UserService.getConnectedUsersRef().$bind($scope, "connectedUsers");
    WhiteBoardService.getComponents().$bind($scope, "components");

    $scope.$watch("connectedUsers", function(val) {
        $scope.nbConnectedUsers = _.size($filter('cleanFirebaseObject')($scope.connectedUsers));
    });

    $scope.$on("deleteComponent", function(event, componentKey) {
        delete $scope.components[componentKey];
        $scope.$apply();
    });

    var onClickOnWhiteBoard = function (event) {

        if (event.target.id == "whiteboard") {

            event.preventDefault();
            event.stopPropagation();

            WhiteBoardService.addTextComponent(event.offsetX, event.offsetY);
        }

        angular.element("#whiteboard").off('mouseup', onClickOnWhiteBoard);
        angular.element("#navbar").off('mouseup', onClickOnNavBar);
    };

    var onClickOnNavBar = function(event) {
        angular.element("#whiteboard").off('mouseup', onClickOnWhiteBoard);
        angular.element("#navbar").off('mouseup', onClickOnNavBar);
    };

    /* TODO : add component general function and just pass the type on clicking on text */
    $scope.addText = function() {

        angular.element("#whiteboard").on('mouseup', onClickOnWhiteBoard);
        angular.element("#navbar").on('mouseup', onClickOnNavBar);
    };

    var setNavbarZoom = function(zoom) {
        var h = document.getElementById("navbar");
        h.style.zoom = zoom;
    };

    setNavbarZoom(window.innerWidth/screen.width);

    $(window).resize(function() { setNavbarZoom(window.innerWidth/screen.width); });
});