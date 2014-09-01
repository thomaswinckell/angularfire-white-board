app.controller('MainController',
    function ($scope, $rootScope, WhiteBoardService, $document, $firebase, $timeout, UserService, $filter, u, WHITE_BOARD_PROPERTIES) {

    UserService.getConnectedUsersRef().$bind($scope, "connectedUsers");

    $scope.$watch("connectedUsers", function(val) {
        $scope.nbConnectedUsers = u.size($filter('orderByPriority')($scope.connectedUsers));
    });

    $scope.whiteBoardCommands = {};
    $scope.isControlModeEnabled = false;

    /* Component add */

    var componentType;

    var onAddComponent = function (event) {

        if (event.target.id == "whiteboard") {

            event.preventDefault();
            event.stopPropagation();

            $scope.whiteBoardCommands.addComponent({
                x: event.offsetX - event.offsetX % WHITE_BOARD_PROPERTIES.gridWidth,
                y: event.offsetY - event.offsetY % WHITE_BOARD_PROPERTIES.gridWidth,
                type: componentType
            });
        }

        $document.off('mouseup', onAddComponent);
    };

    $scope.addComponent = function(type) {

        componentType = type;
        $document.on('mouseup', onAddComponent);
    };

    /* White board top position */

    $scope.whiteBoardStyle = {};

    var updateWhiteBoardTop = function(zoom) {

        $scope.whiteBoardStyle.top = Math.round($("#navbar").height() * zoom);
    };

    /* Navigation bar zoom */

    var setNavbarZoom = function(zoom) {

        var h = document.getElementById("navbar");
        h.style.zoom = zoom;

        updateWhiteBoardTop(zoom);
    };

    setNavbarZoom(window.innerWidth/screen.width);

    $(window).resize(function() {

        setNavbarZoom(window.innerWidth/screen.width);
        $scope.$apply();
    });

    // We do this to avoid scrolling up when drag and scroll up in the navigation bar
    angular.element("#navbar").on('mousedown', function(event) {
        event.preventDefault();
        event.stopPropagation();
    });
});