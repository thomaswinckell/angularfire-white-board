/**
 * Created by Thomas on 08/07/2014.
 */

app.directive('textEditor', function($timeout) {
    return {
        restrict: 'EA',
        replace: true,
        templateUrl: 'app/directive/component/textEditor/textEditorTemplate.html',
        controller: function($scope) {

            var getYoutubeVideoValueByUrl = function(url) {

                var splitedUrl = url.split("youtube.com/embed/");

                if (splitedUrl.length === 2)
                    return splitedUrl[1];

                splitedUrl = url.split("youtube.com/watch?v=");

                if (splitedUrl.length === 2)
                    return splitedUrl[1];

                return null;
            };

            $scope.$watch('component.value', function(val) {

                if (!_.isUndefined(val)) {

                    var componentValue = getYoutubeVideoValueByUrl(val);

                    if (componentValue != null) {
                        $scope.component.value = componentValue;
                        $scope.component.type = "youtube";
                        $timeout(function(){});
                    }
                }
            });
        }
    }
})
