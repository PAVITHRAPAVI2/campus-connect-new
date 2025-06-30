import React, { useState, useEffect, useRef } from 'react';
import './styless/GroupChat.css';

const CommonGroupChat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const userName = localStorage.getItem('userName') || 'You';
    const chatEndRef = useRef(null);

    useEffect(() => {
        const savedMessages = JSON.parse(localStorage.getItem('commonChatMessages')) || [];
        setMessages(savedMessages);
    }, []);

    useEffect(() => {
        localStorage.setItem('commonChatMessages', JSON.stringify(messages));
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = () => {
        if (input.trim() === '') return;

        const newMessage = {
            id: Date.now(),
            sender: userName,
            text: input,
            time: new Date().toLocaleTimeString(),
        };

        setMessages([...messages, newMessage]);
        setInput('');
    };

    return (
        <div className="chat-container">
            <div className="chat-header">💬 Common Group Chat</div>

            <div className="chat-box">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`chat-message ${msg.sender === userName ? 'sent' : 'received'}`}
                    >
                        <span className="sender">{msg.sender}:</span> {msg.text}
                        <span className="timestamp">{msg.time}</span>
                    </div>
                ))}
                <div ref={chatEndRef}></div>
            </div>

            <div className="chat-input">
                <input
                    type="text"
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <button onClick={handleSend}>Send</button>
            </div>
        </div>
    );
};

export default CommonGroupChat;
