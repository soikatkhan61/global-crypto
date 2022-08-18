const express = require("express")
const morgan = require("morgan")
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');
const setLocals = require('./setLocals')

//import our middleware
const {bindUserWithRequest} = require('./authMiddleware');



let MONGODB_URI
if (true) {
    MONGODB_URI = `mongodb+srv://admin:admin@cluster0.ljfyxtq.mongodb.net/test`
} else {
    MONGODB_URI = "mongodb://localhost:27017"
}


const middleware = [
    express.static('public'),
    morgan('dev'),
    express.urlencoded({ extended: true }),
    express.json(),
    session({
        secret: "This is secret message",
        resave: false,
        saveUninitialized: false
    }),
    flash(),
    bindUserWithRequest(),
    setLocals()
]


module.exports = app => {
    middleware.forEach(m => {
        app.use(m)
    })
}