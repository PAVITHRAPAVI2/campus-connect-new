import React, { useState, useEffect } from 'react';
import '../../Pages/Student/student style/Chat.css';
import DashboardLayout from '../../components/Styless/DashboardLayout';
import BASE_URL from '../../config';

const CommonGroupChatContent = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [groupId, setGroupId] = useState(null);
    const user = JSON.parse(localStorage.getItem('user')) || { name: 'You', collegeId: '' };

    // Load common group and its messages
    useEffect(() => {
        fetchCommonGroup();
    }, []);

    const fetchCommonGroup = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${BASE_URL}/api/Message/groups`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const groups = await res.json();
            const commonGroup = groups.find((g) => g.isCommon);
            if (commonGroup) {
                setGroupId(commonGroup.id);
                fetchMessages(commonGroup.id);
            } else {
                console.error('No common group found.');
            }
        } catch (err) {
            console.error('Failed to load groups:', err);
        }
    };

    const fetchMessages = async (groupId) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${BASE_URL}/api/Message/groups/${groupId}/messages`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setMessages(data);
        } catch (err) {
            console.error('Failed to load messages:', err);
        }
    };

    const handleSend = async () => {
        if (input.trim() === '' || !groupId) return;

        const newMessage = {
            content: input,
            groupId: groupId,
        };

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${BASE_URL}/api/Message/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(newMessage),
            });

            if (res.ok) {
                setInput('');
                fetchMessages(groupId); // Refresh messages after sending
            } else {
                console.error('Failed to send message');
            }
        } catch (err) {
            console.error('Error while sending message:', err);
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-header">💬 Common Group Chat</div>
            <div className="chat-box">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`chat-message ${msg.senderCollegeId === user.collegeId ? 'sent' : 'received'}`}
                    >
                        <span className="sender">{msg.senderCollegeId} ({msg.senderRole}):</span> {msg.content}
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