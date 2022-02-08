const session = require('express-session');

const sessionManager = (app) => {
    app.set('trust proxy', 1)

    app.use(session({
        secret: 'HELLOOO',
        resave: true,
        cookie: {
            masAge: 864000,
            httpOnly: true
        },
        saveUninitialized: false
    }))
}

module.exports = sessionManager;
