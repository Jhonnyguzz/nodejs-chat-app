const users = []

const addUser = ({ id, username, room }) => {
    // Clean the data
    username = username.trim()
    room = room.trim().toLowerCase()

    // Validate the data
    if (!username || !room) {
        return {
            error: 'Username and room are required!'
        }
    }

    // Check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    // Validate username
    if (existingUser) {
        existingUser.id = id;
        existingUser.connected = true;
        return { user: existingUser };
    } else {
        const user = { id, username, room, connected: true };
        users.push(user);
        return { user };
    }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const online = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if (index !== -1) {
        users[index].connected = true
    }
}

const offline = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if (index !== -1) {
        users[index].connected = false
        return users[index]
    }
}

const getUser = (id) => {
    return users.find((user) => user.id === id)
}

const getUserByUsername = (username) => {
    return users.find((user) => user.username === username)
}

const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    return users.filter((user) => user.room === room)
}

module.exports = {
    addUser,
    removeUser,
    online,
    offline,
    getUser,
    getUsersInRoom,
    getUserByUsername
}