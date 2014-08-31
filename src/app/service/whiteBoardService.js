app.service('WhiteBoardService', function (FIREBASE_URL, $firebase, COMPONENT_PROPERTIES, u) {

    var indexMaxComponentRef = new Firebase(FIREBASE_URL + 'whiteBoard/indexMaxComponent');
    var componentsRef = new Firebase(FIREBASE_URL + 'whiteBoard/components');
    var lastComponentRefAddedByCurrentUser = null;

    var indexMaxComponent;

    indexMaxComponentRef.on("value", function(snapshot) {

        indexMaxComponent = snapshot.val();

        if (u.isUndefined(indexMaxComponent)) {
            indexMaxComponent = 0;
        }
    });

    var controlModeEnabled = false;

    this.setControlModeEnabled = function(isEnabled) {
        controlModeEnabled = isEnabled;
    };

    this.isControlModeEnabled = function() {
      return controlModeEnabled;
    };

    this.getIndexMaxComponent = function() {

        var saveIndexMaxComponent = indexMaxComponent;

        indexMaxComponentRef.transaction(function(currentIndexMaxComponent) {
            indexMaxComponent = currentIndexMaxComponent;
            return (currentIndexMaxComponent || 0) + 1;
        });

        return saveIndexMaxComponent;
    };

    this.getLastComponentKeyAddedByCurrentUser = function() {

        if (lastComponentRefAddedByCurrentUser == null)
            return null;

        return lastComponentRefAddedByCurrentUser.name();
    };

    this.getComponents = function() {
      return $firebase(componentsRef);
    };

    this.getWhiteBoardSize = function() {
        return $firebase(whiteBoardSizeRef);
    };

    this.addComponent = function(component) {

        var newComponent = {
            height: COMPONENT_PROPERTIES.defaultHeight, width: COMPONENT_PROPERTIES.defaultWidth,
            index: this.getIndexMaxComponent()
        };

        angular.extend(newComponent, component);

        lastComponentRefAddedByCurrentUser = componentsRef.push(newComponent);
    };
});