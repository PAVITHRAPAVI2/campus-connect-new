import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './styless/GroupChat.css';

const DepartmentGroupChat = () => {
    const { department } = useParams();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    const user = JSON.parse(localStorage.getItem('user')) || {
        name: 'You',
        department: department || 'CS',
    };

    const departmentKey = `deptChatMessages_${user.department.replace(/\s+/g, '_').toLowerCase()}`;

    useEffect(() => {
        const savedMessages = JSON.parse(localStorage.getItem(departmentKey)) || [];
        setMessages(savedMessages);
    }, [departmentKey]);

    useEffect(() => {
        localStorage.setItem(departmentKey, JSON.stringify(messages));
    }, [messages, departmentKey]);

    const handleSend = () => {
        if (input.trim() === '') return;
        const newMessage = {
            id: messages.length + 1,
            sender: user.name,
            text: input,
        };
        setMessages([...messages, newMessage]);
        setInput('');
    };

    return (
        <div className="chat-container">
            <div className="chat-header">📚 {user.department} Department Chat</div>

            <div className="chat-box">
                {messages.map((msg) => (
                    <div key={msg.id} className={`chat-message ${msg.sender === user.name ? 'sent' : 'received'}`}>
                        <span className="sender">{msg.sender}:</span> {msg.text}
                    </div>
                ))}
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

export default DepartmentGroupChat;