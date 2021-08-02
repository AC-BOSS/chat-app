import React from 'react';
import Message from '../Message/Message';
import './Messages.css';

const Messages = ({messages, name}) => {
    return (
        <div className="messages">
            {messages.map((message, index) => <div key={index}><Message message={message} name={name} /></div>)}
        </div>
    )
}

export default Messages;