/**
 * Created by Thomas on 08/07/2014.
 */

app.directive('component', function() {
    return {
        restrict: 'EA',
        transclude: true,
        replace: true,
        templateUrl: 'app/directive/core/component/componentTemplate.html',
        link: function(scope, element, attrs) {
        },
        controller: function($scope) {
        }
    }
});

