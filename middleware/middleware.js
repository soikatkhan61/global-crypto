const express = require("express")
const morgan = require("morgan")

const middleware = [
    express.static('public'),
    morgan('dev')
]


module.exports = app =>{
    middleware.forEach(m =>{
        app.use(m)
    })
}