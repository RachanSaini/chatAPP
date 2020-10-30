const socket = io()

socket.on('message', (message) => {
    console.log(message)
})

document.querySelector('#message-form').addEventListener('submit', (e) => {
    e.preventDefault()

    const message = e.target.elements.message.value
    socket.emit('sendMessage', message)
})

document.querySelector('#location').addEventListener('click', () => {
    if(!navigator.geolocation){
        return alert('Geolocation is not supported.')
    }

    navigator.geolocation.getCurrentPosition( (position) => { 
        socket.emit('location', {
            lattitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    })
})