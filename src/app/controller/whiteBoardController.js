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

    /* Control mode management */

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

        $("#whiteboard").focus();

        if (WHITE_BOARD_PROPERTIES.isEnableControlModeEvent(event)) {
            enableControlMode();
        } else if ($scope.isControlModeEnabled) {
            disableControlMode();
        }
    });

    $document.on('mouseleave', function(event) {

        $("#whiteboard").blur();

        if (WHITE_BOARD_PROPERTIES.isDisableControlModeEvent(event)) {
            disableControlMode();
        }
    });

    /* Component add */

    var onAddComponent = function (event) {

        if (event.target.id == "whiteboard") {

            event.preventDefault();
            event.stopPropagation();

            WhiteBoardService.addTextComponent(event.offsetX, event.offsetY);
        }

        $document.off('mouseup', onAddComponent);
    };

    $scope.addText = function() {

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

    /* White Board Size */

    var getWhiteBoardSize = function() {
        return { height: ($document.height() - $scope.whiteBoardStyle.top) + 'px', width: $document.width() + 'px' };
    };

    $scope.$watch(getWhiteBoardSize, function (newWhiteBoardSize) {
          angular.extend($scope.whiteBoardStyle, newWhiteBoardSize);
    }, true);

    /* Drag-scrollable white board */

    // We do this to avoid scrolling up when drag and scroll up in the navigation bar
    angular.element("#navbar").on('mousedown', function(event) {
        event.preventDefault();
        event.stopPropagation();
    });

    var startX, startY, startScrollLeft, startScrollTop;

    angular.element("#whiteboard").on('mousedown', function(event) {

        event.preventDefault();
        event.stopPropagation();

        startX = event.screenX;
        startY = event.screenY;
        startScrollLeft = $("body").scrollLeft();
        startScrollTop = $("body").scrollTop();

        $document.on('mousemove', onMouseMove);
        $document.on('mouseup', onMouseUp);
    });

    var onMouseMove = function(event) {

        var newScrollTop = startScrollTop - (event.screenY - startY);
        var newScrollLeft = startScrollLeft - (event.screenX - startX);

        var scrollHeight = $(document).height() - $(window).height();
        var scrollWidth = $(document).width() - $(window).width();

        var sizeChanged = false;

        if (scrollHeight < newScrollTop) {
            $scope.whiteBoardStyle.height = (parseInt($scope.whiteBoardStyle.height) + newScrollTop - scrollHeight) + 'px';
            sizeChanged = true;
        }

        if (scrollWidth < newScrollLeft) {
            $scope.whiteBoardStyle.width = (parseInt($scope.whiteBoardStyle.width) + newScrollLeft - scrollWidth) + 'px';
            sizeChanged = true;
        }

        if (sizeChanged) {
            $scope.$apply();
        }

        $("body").scrollTop(newScrollTop);
        $("body").scrollLeft(newScrollLeft);
    };

    var onMouseUp = function(event) {

        $document.off('mousemove', onMouseMove);
        $document.off('mouseup', onMouseUp);
    };
});