/**
 * Created by Thomas on 08/07/2014.
 */

app.directive('text', function() {
    return {
        restrict: 'EA',
        replace: true,
        templateUrl: 'app/directive/component/text/textTemplate.html',
        link: function (scope, element, attrs) {
        }
    }
});
