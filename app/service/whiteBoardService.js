app.service('WhiteBoardService', function (URL_DATABASE, $firebase) {

    var indexMaxComponentRef = new Firebase(URL_DATABASE + 'whiteBoard/indexMaxComponent');
    var componentsRef = new Firebase(URL_DATABASE + 'whiteBoard/components');
    var lastComponentRefAddedByCurrentUser = null;

    var indexMaxComponent;

    indexMaxComponentRef.on("value", function(snapshot) {
        indexMaxComponent = snapshot.val();
    });

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
            height: 200, width: 200,
            index: this.getIndexMaxComponent()
        });
    };
});