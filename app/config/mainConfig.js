app.constant("FIREBASE_URL",'https://brilliant-fire-7355.firebaseio.com/');

app.constant("AUTHENTICATION", {
    enabled : false,
    loginProvider: 'google',
    options: {
        preferRedirect: true,
        rememberMe: true,
        scope: 'https://www.googleapis.com/auth/plus.login'
    }
});

app.constant("COMPONENT_PROPERTIES", {
    MIN_HEIGHT: 100,
    MIN_WIDTH: 100
});