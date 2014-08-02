app.service('UserService', function (FIREBASE_URL, $firebase) {

    var connectedUsersRef = new Firebase(FIREBASE_URL + 'whiteBoard/connectedUsers');
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

