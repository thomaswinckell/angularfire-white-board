/**
 * Created by Thomas on 08/07/2014.
 */

app.directive('textEditor', function() {
    return {
        restrict: 'EA',
        replace: true,
        templateUrl: 'app/directive/component/textEditor/textEditorTemplate.html',
        controller: function($scope) {
        }
    }
})
