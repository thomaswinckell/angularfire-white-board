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

            var setComponentX = function(newX) {
                if (newX > 0)
                    scope.component.x = newX;
                else
                    scope.component.x = 0;
            };

            var setComponentY = function(newY) {
                if (newY > 0)
                    scope.component.y = newY;
                else
                    scope.component.y = 0;
            };

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

                scope.component.x = negativeScroll ? scope.component.x - COMPONENT_PROPERTIES.spaceBetweenBorderToLaunchScroll : scope.component.x + COMPONENT_PROPERTIES.spaceBetweenBorderToLaunchScroll;

                if (scope.component.x < 0) {
                    scope.component.x = 0;
                    return;
                }

                $("body").scrollLeft(negativeScroll ? $("body").scrollLeft() - COMPONENT_PROPERTIES.spaceBetweenBorderToLaunchScroll : $("body").scrollLeft() + COMPONENT_PROPERTIES.spaceBetweenBorderToLaunchScroll);

                lastTimeoutScrollLeft = $timeout(function () {
                    if (scope.isDragging) {
                        scrollLeft(negativeScroll);
                    }
                }, 100);
            };

            var scrollTop = function(negativeScroll) {

                scope.component.y = negativeScroll ? scope.component.y - COMPONENT_PROPERTIES.spaceBetweenBorderToLaunchScroll : scope.component.y + COMPONENT_PROPERTIES.spaceBetweenBorderToLaunchScroll;

                if (scope.component.y < 0) {
                    scope.component.y = 0;
                    return;
                }

                $("body").scrollTop(negativeScroll ? $("body").scrollTop() - COMPONENT_PROPERTIES.spaceBetweenBorderToLaunchScroll : $("body").scrollTop() + COMPONENT_PROPERTIES.spaceBetweenBorderToLaunchScroll);

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

                if  ((event.clientX + COMPONENT_PROPERTIES.spaceBetweenBorderToLaunchScroll) >= $(window).width()) {

                    scrollLeft(false);

                } else if ((event.clientX - COMPONENT_PROPERTIES.spaceBetweenBorderToLaunchScroll) <= 0) {

                    scrollLeft(true);
                }

                if  ((event.clientY + COMPONENT_PROPERTIES.spaceBetweenBorderToLaunchScroll) >= $(window).height()) {

                    scrollTop(false);

                } else if ((event.clientY - COMPONENT_PROPERTIES.spaceBetweenBorderToLaunchScroll) <= 0) {

                    scrollTop(true);
                }

                var y = event.pageY - startY;
                var x = event.pageX - startX;

                if ((Math.abs(scope.component.x - x) >= WHITE_BOARD_PROPERTIES.gridWidth) ||
                    (Math.abs(scope.component.y - y) >= WHITE_BOARD_PROPERTIES.gridWidth)) {

                    x = x - x % WHITE_BOARD_PROPERTIES.gridWidth;
                    y = y - y % WHITE_BOARD_PROPERTIES.gridWidth;

                    setComponentX(x);
                    setComponentY(y);

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
                scope.$emit("deleteSelectedComponent");
            };

            var onKeyUp = function (event) {

                if (scope.isSelected() && !scope.isEditMode) {

                    if (COMPONENT_PROPERTIES.isDeleteEvent(event)) {
                        scope.deleteComponent();
                        return;
                    }

                    if (COMPONENT_PROPERTIES.isMoveEvent(event)) {

                        event.preventDefault();
                        event.stopPropagation();

                        if (COMPONENT_PROPERTIES.isMoveUpEvent(event)) {
                            setComponentY(scope.component.y - WHITE_BOARD_PROPERTIES.gridWidth);
                        }

                        if (COMPONENT_PROPERTIES.isMoveDownEvent(event)) {
                            setComponentY(scope.component.y + WHITE_BOARD_PROPERTIES.gridWidth);
                        }

                        if (COMPONENT_PROPERTIES.isMoveLeftEvent(event)) {
                            setComponentX(scope.component.x - WHITE_BOARD_PROPERTIES.gridWidth);
                        }

                        if (COMPONENT_PROPERTIES.isMoveRightEvent(event)) {
                            setComponentX(scope.component.x + WHITE_BOARD_PROPERTIES.gridWidth);
                        }

                        scope.$apply();

                        return;
                    }
                }
            };

            $document.on('keyup', onKeyUp);

            scope.$on('editSelectedComponent', function(event) {
                if (scope.isSelected()) {
                    scope.onEditComponent(event);
                }
            });
        },
        controller: function($scope) {

            $scope.resizerHorizontalOrVerticalWidth = COMPONENT_PROPERTIES.resizerHorizontalOrVerticalWidth;
            $scope.resizerHorizontalAndVerticalWidth = COMPONENT_PROPERTIES.resizerHorizontalAndVerticalWidth;

            $scope.isEditMode = (WhiteBoardService.getLastComponentKeyAddedByCurrentUser() === $scope.componentKey);
            $scope.isDragging = false;

            $scope.onEditComponent = function(event) {

                if ($scope.isControlModeEnabled && !$scope.isEditMode &&
                    COMPONENT_PROPERTIES.hasEditMode($scope.component.type)) {

                    event.preventDefault();

                    $scope.isEditMode = true;
                    $scope.onEnterEditMode();
                }
            };
        }
    }
});

