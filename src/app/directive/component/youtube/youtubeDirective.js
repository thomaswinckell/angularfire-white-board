app.directive('youtube', function() {
    return {
        restrict: 'EA',
        replace: true,
        templateUrl: 'app/directive/component/youtube/youtubeTemplate.html',
        link: function (scope, element, attrs) {

            scope.$watch('component.value', function(val) {

                scope.iframeSrc = "//www.youtube.com/embed/" + val;
            });
        }
    };
});