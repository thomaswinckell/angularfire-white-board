/**
 * Created by Thomas on 03/08/2014.
 */

app.directive('youtube', function() {
    return {
        restrict: 'EA',
        replace: true,
        templateUrl: 'app/directive/component/youtube/youtubeTemplate.html',
        link: function (scope, element, attrs) {

            scope.$watch('component.value', function(val) {

                if (!_.isUndefined(val)) {
                    element[0].src = "//www.youtube.com/embed/" + val;
                }
            });
        }
    }
});