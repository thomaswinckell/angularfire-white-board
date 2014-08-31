app.directive('whiteBoard', function(WhiteBoardService, WHITE_BOARD_PROPERTIES, $document) {
    return {
        restrict: 'EA',
        replace: true,
        scope: {
            whiteBoardStyle: '=',
            commands: '='
        },
        templateUrl: 'app/directive/core/whiteBoard/whiteBoardTemplate.html',
        link: function (scope, element, attrs) {

            scope.$on("deleteComponent", function(event, componentKey) {
                delete scope.components[componentKey];
                scope.$apply();
            });

            /* Control mode management */

            var enableControlMode = function() {

                scope.$broadcast("enableControlMode");
                scope.isControlModeEnabled = true;
                WhiteBoardService.setControlModeEnabled(true);
                scope.$apply();
            };

            var disableControlMode = function() {

                scope.$broadcast("disableControlMode");
                scope.isControlModeEnabled = false;
                WhiteBoardService.setControlModeEnabled(false);
                scope.$apply();
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

                element[0].focus();

                if (WHITE_BOARD_PROPERTIES.isEnableControlModeEvent(event)) {
                    enableControlMode();
                } else if (scope.isControlModeEnabled) {
                    disableControlMode();
                }
            });

            $document.on('mouseleave', function(event) {

                element[0].blur();

                if (WHITE_BOARD_PROPERTIES.isDisableControlModeEvent(event)) {
                    disableControlMode();
                }
            });

            /* Drag-scrollable white board */

            var startX, startY, startScrollLeft, startScrollTop;

            element.on('mousedown', function(event) {

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
                    scope.whiteBoardStyle.height = (parseInt(scope.whiteBoardStyle.height) + newScrollTop - scrollHeight) + 'px';
                    sizeChanged = true;
                }

                if (scrollWidth < newScrollLeft) {
                    scope.whiteBoardStyle.width = (parseInt(scope.whiteBoardStyle.width) + newScrollLeft - scrollWidth) + 'px';
                    sizeChanged = true;
                }

                if (sizeChanged) {
                    scope.$apply();
                }

                $("body").scrollTop(newScrollTop);
                $("body").scrollLeft(newScrollLeft);
            };

            var onMouseUp = function(event) {

                $document.off('mousemove', onMouseMove);
                $document.off('mouseup', onMouseUp);
            };
        },
        controller: function($scope, WhiteBoardService) {

            WhiteBoardService.getComponents().$bind($scope, "components");

            /* White Board Size */

            var getWhiteBoardSize = function() {
                return { height: ($document.height() - $scope.whiteBoardStyle.top) + 'px', width: $document.width() + 'px' };
            };

            $scope.$watch(getWhiteBoardSize, function (newWhiteBoardSize) {
                angular.extend($scope.whiteBoardStyle, newWhiteBoardSize);
            }, true);

            $scope.commands.addComponent = function (component) {

                WhiteBoardService.addComponent(component);
            };
        }
    }
});
