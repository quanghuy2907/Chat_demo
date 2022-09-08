const users: {
    id: string;
    username: string;
    room: string;
}[] = [];

// Join user to chat
function userJoin(id: string, username: string, room: string) {
    const user = { id, username, room };

    users.push(user);

    return user;
}

//Get the current user
function getCurrentUser(id: string) {
    return users.find(user => user.id === id);
}

// User leave chat 
function userLeave(id: string) {
    const index = users.findIndex(user => user.id === id);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }

    return { id: '', username: '', room: '' }
}

// Get room users
function getRoomUsers(room: string) {
    return users.filter(user => user.room === room);
}

export { userJoin, userLeave, getRoomUsers }