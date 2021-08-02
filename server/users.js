const users = [];

const addUser = ({id, name, room}) => {
    name = name.trim().toLowerCase();
    room = room.trim().toLowerCase();

    const existingUser = users.find(user => user.room == room && user.name == name);
    if(existingUser) {
        return {error: "Username already taken"}
    }
    const user = {id, name, room};
    users.push(user);
    console.log("users in addUser:", users);
    return {user};
}
const removeUser = (id) => {
    console.log("id:", id);
    const index = users.findIndex(user => user.id === id);
    console.log("Remove User Index:", index);
    if(index !== undefined) {
        return users.splice(index, 1)[0];
    }
}
const getUser = (id) => {
    console.log("users in getUser:", users);
    const user =  users.find(user => user.id === id)
    console.log("getusers:", user);
    return user;
}

const getUserInRoom = (room) => users.filter(user => user.room === room);

module.exports = {addUser, removeUser, getUser, getUserInRoom}