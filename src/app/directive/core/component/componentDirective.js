app.directive('component', function($compile, $document, WHITE_BOARD_PROPERTIES, WhiteBoardService,
                                    COMPONENT_PROPERTIES, $timeout) {
    return {
        restrict: 'EA',
        replace: true,
        templateUrl: 'app/directive/core/component/componentTemplate.html',
        link: function(scope, element, attrs) {

            scope.$watch('component.type', function(componentType) {
                $(element).find('.component').html($compile('<' + componentType + '></' + componentType + '>')(scope));
            });

            /* Drag and drop, resize */

            var wasSelected = false;

            scope.isSelected = function() {

                if (WhiteBoardService.getSelectedComponent() == scope.componentKey) {

                    wasSelected = true;
                    return true;

                } else {

                    if (wasSelected) {
                        scope.isEditMode = false;
                        scope.component.selectedBy = false;
                        wasSelected = false;
                    }

                    return false;
                }
            };

            var startX, startY, startWidth, startHeight, startPageX, startPageY;

            scope.onMouseDownOnElement = function (event) {

                if (!scope.isControlModeEnabled)
                    return;

                startX = event.pageX - scope.component.x;
                startY = event.pageY - scope.component.y;

                startWidth = scope.component.width;
                startHeight = scope.component.height;

                startPageX = event.pageX;
                startPageY = event.pageY;

                var isResizing = false;

                if ($(event.target).hasClass("resizer")) {

                    event.preventDefault();
                    event.stopPropagation();

                    if ($(event.target).hasClass("resizer-width"))
                        scope.isResizingWidth = true;

                    if ($(event.target).hasClass("resizer-height"))
                        scope.isResizingHeight = true;

                    isResizing = true;
                }

                if (!scope.isEditMode) {

                    WhiteBoardService.setSelectedComponent(scope.componentKey);
                    scope.component.selectedBy = scope.currentUserKey;

                    element[0].focus();

                    if (!isResizing) {

                        event.preventDefault();
                        event.stopPropagation();

                        scope.isDragging = true;
                    }
                }

                if (!scope.isEditMode || (scope.isResizingWidth || scope.isResizingHeight)) {
                    $document.on('mousemove', onMouseMove);
                    $document.on('mouseup', onMouseUp);
                }
            };

            var onMouseMove = function(event) {

                var shouldApply = false;

                if (scope.isDragging) {
                    shouldApply = onMouseDrag(event);
                } else {

                    if (scope.isResizingWidth) {
                        shouldApply = onMouseResizeWidth(event);
                    }

                    if (scope.isResizingHeight) {
                        shouldApply = onMouseResizeHeight(event) || shouldApply;
                    }
                }

                if (shouldApply) {
                    scope.$apply();
                }
            };

            var onMouseResizeWidth = function (event) {

                var width = startWidth + (event.pageX - startPageX);

                if (Math.abs(scope.component.width - width) >= WHITE_BOARD_PROPERTIES.gridWidth) {

                    width = width - width % WHITE_BOARD_PROPERTIES.gridWidth;

                    if (width > COMPONENT_PROPERTIES.minWidth)
                        scope.component.width = width;
                    else
                        scope.component.width = COMPONENT_PROPERTIES.minWidth;

                    return true;
                }

                return false;
            };

            var onMouseResizeHeight = function (event) {

                var height = startHeight + (event.pageY - startPageY);

                if (Math.abs(scope.component.height - height) >= WHITE_BOARD_PROPERTIES.gridWidth) {

                    height = height - height % WHITE_BOARD_PROPERTIES.gridWidth;

                    if (height > COMPONENT_PROPERTIES.minHeight)
                        scope.component.height = height;
                    else
                        scope.component.height = COMPONENT_PROPERTIES.minHeight;

                    return true;
                }

                return false;
            };

            var lastTimeoutScrollLeft = false, lastTimeoutScrollTop = false;

            var scrollLeft = function(negativeScroll) {

                scope.component.x = negativeScroll ? scope.component.x - 50 : scope.component.x + 50;

                if (scope.component.x < 0) {
                    scope.component.x = 0;
                    return;
                }

                $("body").scrollLeft(negativeScroll ? $("body").scrollLeft() - 50 : $("body").scrollLeft() + 50);

                lastTimeoutScrollLeft = $timeout(function () {
                    if (scope.isDragging) {
                        scrollLeft(negativeScroll);
                    }
                }, 100);
            };

            var scrollTop = function(negativeScroll) {

                scope.component.y = negativeScroll ? scope.component.y - 50 : scope.component.y + 50;

                if (scope.component.y < 0) {
                    scope.component.y = 0;
                    return;
                }

                $("body").scrollTop(negativeScroll ? $("body").scrollTop() - 50 : $("body").scrollTop() + 50);

                lastTimeoutScrollTop = $timeout(function () {
                    if (scope.isDragging) {
                        scrollTop(negativeScroll);
                    }
                }, 100);
            };

            var clearScrollTimeouts = function() {

                if (lastTimeoutScrollLeft) {
                    $timeout.cancel(lastTimeoutScrollLeft);
                }

                if (lastTimeoutScrollTop) {
                    $timeout.cancel(lastTimeoutScrollTop);
                }
            };

            var onMouseDrag = function (event) {

                clearScrollTimeouts();

                if  ((event.clientX + 50) >= $(window).width()) {

                    scrollLeft(false);

                } else if ((event.clientX - 50) <= 0) {

                    scrollLeft(true);
                }

                if  ((event.clientY + 50) >= $(window).height()) {

                    scrollTop(false);

                } else if ((event.clientY - 50) <= 0) {

                    scrollTop(true);
                }

                var y = event.pageY - startY;
                var x = event.pageX - startX;

                if ((Math.abs(scope.component.x - x) >= WHITE_BOARD_PROPERTIES.gridWidth) ||
                    (Math.abs(scope.component.y - y) >= WHITE_BOARD_PROPERTIES.gridWidth)) {

                    x = x - x % WHITE_BOARD_PROPERTIES.gridWidth;
                    y = y - y % WHITE_BOARD_PROPERTIES.gridWidth;

                    if (x > 0)
                        scope.component.x = x;
                    else
                        scope.component.x = 0;

                    if (y > 0)
                        scope.component.y = y;
                    else
                        scope.component.y = 0;

                    return true;
                }

                return false;
            };

            var onMouseUp = function () {

                if (scope.isDragging) {

                    scope.isDragging = false;
                    $document.off('mousemove', onMouseDrag);
                }

                if (scope.isResizingWidth) {

                    scope.isResizingWidth = false;
                    $document.off('mousemove', onMouseResizeWidth);
                }

                if (scope.isResizingHeight) {

                    scope.isResizingHeight = false;
                    $document.off('mousemove', onMouseResizeHeight);
                }

                if (scope.isSelected()) {
                    scope.component.index = WhiteBoardService.getIndexMaxComponent();
                }

                $document.off('mouseup', onMouseUp);
            };

            scope.deleteComponent = function () {

                $document.off('keyup', onKeyUp);
                scope.$emit("deleteComponent", scope.componentKey);
            };

            var onKeyUp = function (event) {
                if (scope.isSelected() && COMPONENT_PROPERTIES.isDeleteEvent(event) && !scope.isEditMode) {
                    scope.deleteComponent();
                }
            };

            $document.on('keyup', onKeyUp);
        },
        controller: function($scope) {

            $scope.resizerHorizontalOrVerticalWidth = COMPONENT_PROPERTIES.resizerHorizontalOrVerticalWidth;
            $scope.resizerHorizontalAndVerticalWidth = COMPONENT_PROPERTIES.resizerHorizontalAndVerticalWidth;

            $scope.isEditMode = (WhiteBoardService.getLastComponentKeyAddedByCurrentUser() === $scope.componentKey);
            $scope.isDragging = false;

            $scope.onDoubleClick = function(event) {

                if ($scope.isControlModeEnabled && !$scope.isEditMode &&
                    COMPONENT_PROPERTIES.hasEditMode($scope.component.type)) {

                    event.preventDefault();
                    event.stopPropagation();

                    $scope.isEditMode = true;
                    $scope.onEnterEditMode();
                }
            };
        }
    }
});

