const express = require('express')
let router = require('./routers/routeUser')
require('./db/mongoose')
const app = express()
app.use(express.json())
app.use('/users', router);
app.use('/resources',express.static(__dirname + '/src/routers/routeUser.js'));


module.exports = app
