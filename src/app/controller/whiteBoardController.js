app.controller('WhiteBoardController',
    function ($scope, WhiteBoardService, $document, $firebase, $timeout, UserService, $filter, WHITE_BOARD_PROPERTIES) {

    UserService.getConnectedUsersRef().$bind($scope, "connectedUsers");
    WhiteBoardService.getComponents().$bind($scope, "components");

    $scope.$watch("connectedUsers", function(val) {
        $scope.nbConnectedUsers = _.size($filter('orderByPriority')($scope.connectedUsers));
    });

    $scope.$on("deleteComponent", function(event, componentKey) {
        delete $scope.components[componentKey];
        $scope.$apply();
    });

    var enableControlMode = function() {

        $scope.$broadcast("enableControlMode");
        $scope.isControlModeEnabled = true;
        WhiteBoardService.setControlModeEnabled(true);
        $scope.$apply();
    };

    var disableControlMode = function() {

        $scope.$broadcast("disableControlMode");
        $scope.isControlModeEnabled = false;
        WhiteBoardService.setControlModeEnabled(false);
        $scope.$apply();
    };

    $document.on("keydown", function(event) {

        if (WHITE_BOARD_PROPERTIES.isEnableControlModeEvent(event)) {
            enableControlMode();
        }
    });

    $document.on("keyup", function(event) {

        if (WHITE_BOARD_PROPERTIES.isDisableControlModeEvent(event)) {
            disableControlMode();
        }
    });

    $document.on('mouseenter', function(event) {

        if (WHITE_BOARD_PROPERTIES.isEnableControlModeEvent(event)) {
            enableControlMode();
        } else if ($scope.isControlModeEnabled) {
            disableControlMode();
        }
    });

    $document.on('mouseleave', function(event) {

        if (WHITE_BOARD_PROPERTIES.isDisableControlModeEvent(event)) {
            disableControlMode();
        }
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