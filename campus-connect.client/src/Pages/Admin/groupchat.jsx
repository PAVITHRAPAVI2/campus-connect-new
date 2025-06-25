import React, { useState, useEffect } from 'react';
import '../../Pages/admin/groupchat.css';
import DashboardLayout from '../../components/dashboardlayout';

// This is the actual chat UI component
const ChatUI = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    useEffect(() => {
        const savedMessages = JSON.parse(localStorage.getItem('commonChatMessages')) || [];
        setMessages(savedMessages);
    }, []);

    useEffect(() => {
        localStorage.setItem('commonChatMessages', JSON.stringify(messages));
    }, [messages]);

    const handleSend = () => {
        if (input.trim() === '') return;
        const newMessage = {
            id: messages.length + 1,
            sender: 'You',
            text: input,
        };
        const updatedMessages = [...messages, newMessage];
        setMessages(updatedMessages);
        setInput('');
    };

    return (
        <div className="chat-container">
            <div className="chat-header">💬 Common Group Chat</div>
            <div className="chat-box">
                {messages.map((msg) => (
                    <div key={msg.id} className={`chat-message ${msg.sender === 'You' ? 'sent' : 'received'}`}>
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

// This is the exported component with layout
const CommonGroupChatContent = () => {
    return (
        <DashboardLayout>
            <ChatUI />
        </DashboardLayout>
    );
};

export default CommonGroupChatContent;
