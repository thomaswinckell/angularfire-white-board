app.service('WhiteBoardService', function (FIREBASE_URL, $firebase, COMPONENT_PROPERTIES) {

    var indexMaxComponentRef = new Firebase(FIREBASE_URL + 'whiteBoard/indexMaxComponent');
    var componentsRef = new Firebase(FIREBASE_URL + 'whiteBoard/components');
    var lastComponentRefAddedByCurrentUser = null;

    var indexMaxComponent;

    indexMaxComponentRef.on("value", function(snapshot) {

        indexMaxComponent = snapshot.val();

        if (_.isUndefined(indexMaxComponent)) {
            indexMaxComponent = 0;
        }
    });

    var controlModeEnabled = false;

    this.setControlModeEnabled = function(isEnabled) {
        controlModeEnabled = isEnabled;
    };

    this.isControlModeEnabled = function(event) {
      return controlModeEnabled;
    };

    /* TODO : $transaction for lock while update */
    this.getIndexMaxComponent = function() {

        indexMaxComponentRef.set(indexMaxComponent+1);
        return indexMaxComponent;
    };

    this.getLastComponentKeyAddedByCurrentUser = function() {

        if (lastComponentRefAddedByCurrentUser == null)
            return null;

        return lastComponentRefAddedByCurrentUser.name();
    };

    this.getComponents = function() {
      return $firebase(componentsRef);
    };

    this.addTextComponent = function(x, y) {
        lastComponentRefAddedByCurrentUser = componentsRef.push({
            type: 'text',
            x: x, y: y,
            value: "",
            height: COMPONENT_PROPERTIES.defaultHeight, width: COMPONENT_PROPERTIES.defaultWidth,
            index: this.getIndexMaxComponent()
        });
    };
});