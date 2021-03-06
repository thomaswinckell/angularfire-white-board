app.directive('componentEditor', function(COMPONENT_PROPERTIES, $compile, $timeout, $document) {
    return {
        restrict: 'EA',
        replace: true,
        require: "^component",
        templateUrl: 'app/directive/core/componentEditor/componentEditorTemplate.html',
        link: function(scope, element, attrs) {

            if (COMPONENT_PROPERTIES.hasEditMode(scope.component.type)) {

                $(element).html($compile('<' + scope.component.type + '-editor></' + scope.component.type + '-editor>')(scope));
            }

            scope.onEnterEditMode = function () {

                element[0].children[0].focus();
            };

            if (scope.isEditMode) {

                $timeout(function () {
                    scope.onEnterEditMode();
                });
            }
        }
    }
});
