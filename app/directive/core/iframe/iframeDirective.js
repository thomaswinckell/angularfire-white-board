app.directive('iframe', function() {
    return {
        restrict: 'E',
        scope: {
            iframeSrc: '='
        },
        link: function (scope, element, attr) {

            var iframe = $(element);

            iframe.after('<div class="iframe-component-layer"></div>');

            var layer = iframe.next();

            scope.$watch('iframeSrc', function(iframeSrc) {
                if (!_.isUndefined(iframeSrc)) {
                    element[0].src = iframeSrc;
                }
            });

            scope.$on("enableControlMode", function() {
                layer.css('visibility', 'visible');
            });

            scope.$on("disableControlMode", function() {
                layer.css('visibility', 'hidden');
            });

            /* We blur the iframe on mouse leave so the user can press Ctrl command again */
            iframe.mouseleave(function() {
                iframe.blur();
            });
        }
    };
});