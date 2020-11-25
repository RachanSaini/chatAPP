const express = require('express')
const cookieParser = require('cookie-parser');
const userRouter = require('./routers/routeUser')
const MessageRouter = require('./routers/routeMessage')

require('./db/mongoose')
const app = express()
app.use(express.json())
app.use(cookieParser())
app.use('/users', userRouter)
app.use('/messages', MessageRouter)
app.use('/resources',express.static(__dirname + '/src/routers/routeUser.js'))


module.exports = app
