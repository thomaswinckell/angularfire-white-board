app.directive('component', function($compile, COMPONENT_PROPERTIES) {
    return {
        restrict: 'EA',
        replace: true,
        templateUrl: 'app/directive/core/component/componentTemplate.html',
        link: function(scope, element, attrs) {

            $(element).find('.component').html($compile('<'+scope.component.type+'></'+scope.component.type+'>')(scope));

            element.on('mousedown', scope.onMouseDownOnElement);

            scope.offMouseDownOnElement = function() {
                element.off('mousedown', scope.onMouseDownOnElement);
            };
        },
        controller: function($scope, $document, WhiteBoardService, COMPONENT_PROPERTIES) {

            $scope.resizerHorizontalOrVerticalWidth = COMPONENT_PROPERTIES.resizerHorizontalOrVerticalWidth;
            $scope.resizerHorizontalAndVerticalWidth = COMPONENT_PROPERTIES.resizerHorizontalAndVerticalWidth;

            $scope.isEditMode = (WhiteBoardService.getLastComponentKeyAddedByCurrentUser() === $scope.componentKey);
            $scope.isSelected = false;
            $scope.isDragging = false;

            var lastX, lastY;

            var isEventOnComponent = function(event) {
                return $(event.target).parents('#'+$scope.componentKey).length;
            };

            $scope.onMouseDownOnElement = function (event) {

                if (!WhiteBoardService.isControlModeEnabled)
                    return;

                lastX = event.pageX;
                lastY = event.pageY;

                var isResizing = false;

                if ($(event.target).hasClass("resizer")) {

                    event.preventDefault();
                    event.stopPropagation();

                    if ($(event.target).hasClass("resizer-width"))
                        $scope.isResizingWidth = true;

                    if ($(event.target).hasClass("resizer-height"))
                        $scope.isResizingHeight = true;

                    isResizing = true;
                }

                if (!$scope.isEditMode) {

                    $scope.isSelected = true;

                    if (!isResizing) {
                        /*event.preventDefault();
                         event.stopPropagation();*/
                        $scope.isDragging = true;
                    }

                    //$scope.$apply();
                }

                $document.on('mousemove', onMouseMove);
                $document.on('mouseup', onMouseUp);
            };

            var i = 0; /* TODO : constant in config or use timeout (should be better) */

            var onMouseMove = function(event) {

                if ($scope.isResizingWidth) {
                    onMouseResizeWidth(event);
                }

                if ($scope.isResizingHeight) {
                    onMouseResizeHeight(event);
                }

                if ($scope.isDragging) {
                    onMouseDrag(event);
                }

                lastX = event.pageX;
                lastY = event.pageY;

                if ($scope.isDragging) {

                    $scope.$apply();

                } else {

                    if (i==0)
                        $scope.$apply();

                    i = (i + 1)%10;
                }
            };

            var onMouseResizeWidth = function (event) {

                var width = $scope.component.width + (event.pageX - lastX);

                if (width > COMPONENT_PROPERTIES.minWidth)
                    $scope.component.width = width;
                else
                    $scope.component.width = COMPONENT_PROPERTIES.minWidth;
            };

            var onMouseResizeHeight = function (event) {

                var height = $scope.component.height + (event.pageY - lastY);

                if (height > COMPONENT_PROPERTIES.minHeight)
                    $scope.component.height = height;
                else
                    $scope.component.height = COMPONENT_PROPERTIES.minHeight;
            };

            var onMouseDrag = function (event) {

                var x = $scope.component.x + (event.pageX - lastX);
                var y = $scope.component.y + (event.pageY - lastY);

                if (x > 0)
                    $scope.component.x = x;
                else
                    $scope.component.x = 0;

                if (y > 0)
                    $scope.component.y = y;
                else
                    $scope.component.y = 0;
            };

            var onMouseUp = function () {

                if ($scope.isDragging) {

                    $scope.isDragging = false;
                    $document.off('mousemove', onMouseDrag);
                }

                if ($scope.isResizingWidth) {

                    $scope.isResizingWidth = false;
                    $document.off('mousemove', onMouseResizeWidth);
                }

                if ($scope.isResizingHeight) {

                    $scope.isResizingHeight = false;
                    $document.off('mousemove', onMouseResizeHeight);
                }

                $document.off('mouseup', onMouseUp);
                $document.on("mousedown", $scope.onBlur);

                $scope.component.index = WhiteBoardService.getIndexMaxComponent();

                $scope.$apply();
            };

            $scope.onBlur = function(event) {

                if (!isEventOnComponent(event)) {

                    $document.off("mousedown", $scope.onBlur);

                    $scope.isEditMode = false;
                    $scope.isSelected = false;

                    $scope.$apply();
                }
            };

            $scope.deleteComponent = function () {

                $document.off('keyup', onKeyUp);
                $scope.offMouseDownOnElement();

                $scope.$emit("deleteComponent", $scope.componentKey);
            };

            var onKeyUp = function (event) {
                if ($scope.isSelected && (event.keyCode == 46) && !$scope.isEditMode) {
                    $scope.deleteComponent();
                }
            };

            $document.on('keyup', onKeyUp);

            $scope.$on("disableControlMode", function() {

                $scope.isSelected = false;
                onMouseUp();
            });

            $scope.onDoubleClick = function(event) {

                if (WhiteBoardService.isControlModeEnabled && !$scope.isEditMode &&
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

