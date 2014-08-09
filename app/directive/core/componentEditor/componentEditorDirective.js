app.directive('componentEditor', function($timeout, $document) {
    return {
        restrict: 'EA',
        transclude: true,
        replace: true,
        templateUrl: 'app/directive/core/componentEditor/componentEditorTemplate.html',
        link: function (scope, element, attrs) {

            scope.setFocusToComponentEditor = function() {

                element[0].children[0].focus();
            };
        },
        controller: function($scope, UserService) {

            if ($scope.isEditMode) {

                $timeout(function() {
                    $scope.setFocusToComponentEditor();
                    $document.on("mouseup", $scope.onBlur);
                });
            }

            $scope.onEnterEditMode = function($event) {

                $event.preventDefault();
                $event.stopPropagation();

                $scope.setIsEditMode(true);

                $scope.setFocusToComponentEditor();
            };
        }
    }
});
