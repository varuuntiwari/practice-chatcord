const users = [];

// Join user to chat
function userJoin(id, username, room) {
    const user = { id, username, room };
    users.push(user);

    return user;
}

// Get current user
function getCurrUser(id) {
    return users.find(user => user.id === id);
}

// User leaves
function userLeave(id) {
    const index = users.findIndex(user => user.id === id);
    if(index !== -1) {
        // Remove user from list and return user
        return users.splice(index, 1)[0];
    }
}

// Get list of users
function getUsers(room) {
    return users.filter(user => user.room === room)
}

module.exports = {
    userJoin, getCurrUser, userLeave, getUsers
}