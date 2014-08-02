/**
 * Created by Thomas on 05/07/2014.
 */

app.directive('componentContainer', function($document) {
    return {
        restrict: 'EA',
        replace: true,
        transclude: true,
        templateUrl: 'app/directive/core/componentContainer/componentContainerTemplate.html',
        link: function (scope, element) {

            element.on('mousedown', scope.onMouseDownOnElement);

            scope.offMouseDownOnElement = function() {
                element.off('mousedown', scope.onMouseDownOnElement);
            };
        },
        controller: function($scope, WhiteBoardService, TEXT_COMPONENT_PROPERTIES) {

            $scope.isEditMode = (WhiteBoardService.getLastComponentKeyAddedByCurrentUser() === $scope.componentKey);
            $scope.isSelected = false;
            $scope.isDragging = false;

            var lastX, lastY;

            $scope.setIsEditMode = function(isEditMode) {
                $scope.isEditMode = isEditMode;
            };

            $scope.onMouseDownOnElement = function (event) {

                lastX = event.pageX;
                lastY = event.pageY;

                var isResizing = false;

                if ($(event.target).hasClass("resizer")) {

                    event.preventDefault();

                    if ($(event.target).hasClass("resizer-width"))
                        $scope.isResizingWidth = true;

                    if ($(event.target).hasClass("resizer-height"))
                        $scope.isResizingHeight = true;

                    isResizing = true;

                }

                if (!$scope.isEditMode) {

                    event.preventDefault();

                    $scope.isSelected = true;

                    if (!isResizing) {
                        $scope.isDragging = true;
                    }

                    $scope.$apply();
                }

                $document.on('mousemove', onMouseMove);
                $document.on('mouseup', onMouseUp);
            };

            var i = 0; /* TODO : constant or use timeout (should be better) */

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

                if (width > TEXT_COMPONENT_PROPERTIES.MIN_WIDTH)
                    $scope.component.width = width;
                else
                    $scope.component.width = TEXT_COMPONENT_PROPERTIES.MIN_WIDTH;
            };

            var onMouseResizeHeight = function (event) {

                var height = $scope.component.height + (event.pageY - lastY);

                if (height > TEXT_COMPONENT_PROPERTIES.MIN_HEIGHT)
                    $scope.component.height = height;
                else
                    $scope.component.height = TEXT_COMPONENT_PROPERTIES.MIN_HEIGHT;
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

            var onMouseUp = function (event) {

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

            var isEventOnComponent = function(event) {
                return $(event.target).parents('#'+$scope.componentKey).length;
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
                scope.offMouseDownOnElement();

                $scope.$emit("deleteComponent", $scope.componentKey);
            };

            var onKeyUp = function (event) {
                if ($scope.isSelected && (event.keyCode == 46) && !$scope.isEditMode) {
                    $scope.deleteComponent();
                }
            };

            $document.on('keyup', onKeyUp);
        }
    };
});