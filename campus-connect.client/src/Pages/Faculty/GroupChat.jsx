import React, { useState, useEffect } from 'react';
import '../../Pages/styles/GroupChat.css';
import DashboardLayout from '../../components/DashboardLayout';

const CommonGroupChatContent = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const user = JSON.parse(localStorage.getItem('user')) || { name: 'You' };

    // Load messages when component mounts
    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const res = await fetch('/api/chat/common');
            const data = await res.json();
            setMessages(data);
        } catch (err) {
            console.error('Failed to load messages:', err);
        }
    };

    const handleSend = async () => {
        if (input.trim() === '') return;

        const newMessage = {
            sender: user.name,
            text: input,
            timestamp: new Date().toISOString()
        };

        try {
            const res = await fetch('/api/chat/common', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newMessage),
            });

            if (res.ok) {
                const saved = await res.json();
                setMessages([...messages, saved]);
                setInput('');
            }
        } catch (err) {
            console.error('Failed to send message:', err);
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-header">💬 Common Group Chat</div>

            <div className="chat-box">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`chat-message ${msg.sender === user.name ? 'sent' : 'received'}`}
                    >
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

const CommonGroupChat = () => {
    return (
        <DashboardLayout>
            <CommonGroupChatContent />
        </DashboardLayout>
    );
};

export default CommonGroupChat;
