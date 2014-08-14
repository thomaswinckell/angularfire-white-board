app.directive('component', function($compile, COMPONENT_PROPERTIES) {
    return {
        restrict: 'EA',
        replace: true,
        require: "^component",
        templateUrl: 'app/directive/core/component/componentTemplate.html',
        link: function(scope, element, attrs) {

            $(element).html($compile('<'+scope.component.type+'></'+scope.component.type+'>')(scope));
        },
        controller: function($scope, WhiteBoardService) {

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

