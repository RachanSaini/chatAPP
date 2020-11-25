const { use } = require("../app")

const users = []

const addUser = ({ id, username , email, department }) => {
    //Clean qs data
    username = username.trim().toLowerCase()
    email = email.trim().toLowerCase()
    department = department.trim().toLowerCase()

    //Validate the data
    if(!username || !department){
        return {
            error: 'Username, email and department are required!'
        }
    }

    //Check for existing user
    const existingUser = users.find((user) => {
        return user.department === department && user.username === username && user.email === email
    })

    //Validate username
    if(existingUser){
        return {
            error: 'Username is in use!'
        }
    }

    //Store user
    const user = { id, username , email, department}
    users.push(user)
    return { user }
}

//Remove user
const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if( index !== -1){
        return users.splice(index,1)[0]
    }
}

const getUser = (id) => {
    return users.find((user) => user.id === id)
}

// get user in particular department room
const getUsersByRoom = (department) => {
    department = department.trim().toLowerCase()
    return users.filter((user) =>
        user.department === department
    )
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersByRoom
}