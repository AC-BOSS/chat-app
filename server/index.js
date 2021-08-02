const app = require("express")();
const httpServer = require("http").createServer(app);
const cors = require('cors');
const {addUser, removeUser, getUser, getUserInRoom} = require('./users')
const options = {
    cors:true,
    origins:['http://localhost:3000']
};
const io = require("socket.io")(httpServer, options);

const PORT = process.env.PORT || 5000;
const router = require('./router');

io.on("connection", socket => { 
    console.log("We have a new connection");

    socket.on('join', ({name, room}, callback) => {
        // console.log(typeof(socket.id));
        const {error, user} = addUser({id:socket.id, name, room});

        if(error) return callback(error);

        console.log(user);
        socket.emit('message', {user:'admin', text:`${user.name}, welcome to Room ${user.room}`})
        socket.broadcast.to(user.room).emit('message', {user:'admin', text:`${user.name} has joined!`})

        socket.join(user.room);

        io.to(user.room).emit('roomData', {room:user.room, users:getUserInRoom(user.room)})
    })
    
    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);
        console.log("socket id:", socket.id);
        console.log(user);
        io.to(user.room).emit('message', {user:user.name, text:message});
        // io.to(user.room).emit('roomData', {room:user.room, users:getUserInRoom(user.room)});
        callback();
    })
    socket.on("disconnect", (reason) => {
        console.log(reason);
        const user = removeUser(socket.id);
        console.log("removed user:", user);
        if(user){
            io.to(user.room).emit('message', {user:'admin', text:`${user.name} has left the chat`})
            io.to(user.room).emit('roomData', {room:user.room, users:getUserInRoom(user.room)});
        }
    })
});

app.use(router);
app.use(cors());
httpServer.listen(PORT, ()=> console.log(`server has started on port ${PORT}`));