/**
 * Created by Thomas on 05/07/2014.
 */

app.directive('isVisible', function() {
    return {
        restrict: 'EA',
        link: function (scope, element, attr) {

            scope.$watch(attr.isVisible, function(value) {

                if (value) {
                    element.removeClass("not-visible");
                } else {
                    element.addClass("not-visible");
                }
            });
        }
    };
});