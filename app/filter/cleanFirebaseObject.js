app.filter('cleanFirebaseObject', function() {
    return function (object) {
        var res = angular.copy(object);
        angular.forEach(object, function(value, key) {
            if (key[0] == '$') {
                delete res[key];
            }
        });
        return res;
    };
});