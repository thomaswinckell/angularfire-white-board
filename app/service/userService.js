app.service('UserService', function (URL_DATABASE, $firebase) {

    var connectedUsersRef = new Firebase(URL_DATABASE + 'whiteBoard/connectedUsers');
    this.userRef = null;

    this.setCurrentUser = function(user) {
        this.userRef = connectedUsersRef.push({name : user.thirdPartyUserData.name});
        this.userRef.onDisconnect().remove();
    };

    this.getConnectedUsersRef = function() {
        return $firebase(connectedUsersRef);
    };

    this.getCurrentUserKey = function() {
        return this.userRef.name();
    };
});

