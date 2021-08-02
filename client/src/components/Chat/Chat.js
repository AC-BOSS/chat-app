import React, {useState, useEffect} from "react";
import queryString from 'query-string';
import io from 'socket.io-client';
import InfoBar from "../InfoBar/InfoBar";
import Input from "../Input/Input";
import Messages from "../Messages/Messages";
import onlineIcon from '../../icons/onlineIcon.png';
import './Chat.css';

let socket

export default function Chat(props){
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const ENDPOINT = 'localhost:5000'

    useEffect(() => {
        const {name, room} = queryString.parse(props.location.search);

        socket = io(ENDPOINT)

        setName(name);
        setRoom(room);

        console.log(socket);
        socket.emit('join', {name, room}, (response) => {
            if(response)
            {
                window.alert(response);
                window.location.href = '/';
            }
        })

        return () => {
            // socket.emit('disconnect');
            socket.disconnect();
            socket.off();
        }
    }, [ENDPOINT, props.location.search])

    useEffect(() => {
        socket.on('message', (message) => {
            setMessages([...messages, message]);
        })
    }, [messages]);

    useEffect(() => {
        socket.on('roomData', ({room, users}) => {
            setUsers(users);
        })
    }, [users]);

    const sendMessage = (event) => {
        event.preventDefault();

        if(message)
            socket.emit('sendMessage', message, ()=>setMessage('') );
    }
    console.log(message, messages);
    return(
        <div className="outerContainer">
            <div className="container">
                <InfoBar room={room}/>
                <Messages messages={messages} name={name} />
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
                {/* <input 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={event => event.key === "Enter" ? sendMessage(event):null} /> */}
            
            </div>
            <div className="online">
                {users.map((user) => (<div><img src={onlineIcon} alt='online icon' />     {user.name}</div>))}
            </div>
        </div>
    )
}