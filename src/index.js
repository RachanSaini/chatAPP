const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const { generateMessage,generateLocationMessage } =require('./utils/messages')
const { addUser, removeUser, getUser, getUsersByRoom } = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)
const Filter = require('bad-words')

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname,'../public')
app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    console.log('New Websocket connection.')
    
    socket.on('join', (options, callback) => {
        const {error,user} = addUser({id: socket.id , ...options})

        if(error){
            return callback(error)
        }
        
        //Code changes
        if(user.department != null){
            socket.join(user.department)
            socket.emit('message', generateMessage('Admin','Welcome!'))
            socket.broadcast.to(user.department).emit('message', generateMessage('Admin',`${user.username} has joined!`))
            io.to(user.department).emit('departmentData',{
            department: user.department,
            users: getUsersByRoom(user.department)
            })
        }


        // socket.join(user.department)
        // socket.emit('message', generateMessage('Admin','Welcome!'))
        // socket.broadcast.to(user.department).emit('message', generateMessage('Admin',`${user.username} has joined!`))
        // io.to(user.department).emit('departmentData',{
        //     department: user.department,
        //     users: getUsersByRoom(user.department)
        // })

        callback()
    })

    socket.on('sendMessage', (message , callback) => {
        const user = getUser(socket.id)
        const filter = new Filter()
        if(filter.isProfane(message)){
            return callback('Profanity is not allowed.')
        }

        io.to(user.department).emit('message', generateMessage( user.username,message))
        callback()
    })

    socket.on('location', (location, callback) => {
        const user = getUser(socket.id)
        io.to(user.department).emit('locationMessage', generateLocationMessage( user.username ,`https://google.com/maps?q=${location.lattitude},${location.longitude}`))
        callback('Location sent!')
    })
    
//Personal chat
    socket.on('privatechatroom',(data) =>{
        socket.join(data.recipent)
        io.emit('res',{
            mes:"you are added"
        })
    })

    socket.on('sendPrivateMessage', (data) => {
        io.sockets.in(data.username).emit('new_msg', { msg: data.message })
        console.log(data.username)
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if(user){
            io.to(user.department).emit('message', generateMessage(`${user.username} has left!`))
            io.to(user.department).emit('departmentData',{
                department: user.department,
                users: getUsersByRoom(user.department)
            })
        }
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})
