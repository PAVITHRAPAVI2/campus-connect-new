// src/Pages/Chat/CommonGroupChat.jsx
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import DashboardLayout from '../../components/Styless/DashboardLayout';
import './student style/Chat.css';

/* ───────────────────────── AXIOS SETUP ───────────────────────── */
const API = axios.create({
    baseURL: import.meta.env.VITE_API_BASE || '', // Set your backend URL in .env
});

API.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;

    // Force no-cache headers
    config.headers['Cache-Control'] = 'no-cache';
    config.headers['Pragma'] = 'no-cache';
    config.headers['Expires'] = '0';

    return config;
});

/* ───────────────────────── COMPONENT ───────────────────────── */
function CommonGroupChatContent() {
    const [user, setUser] = useState(null);
    const [groups, setGroups] = useState([]);
    const [messages, setMessages] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [input, setInput] = useState('');

    /* ─────── GET USER PROFILE ─────── */
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await API.get(`/api/Auth/profile?ts=${Date.now()}`);
                setUser(data);
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };
        fetchProfile();
    }, []);

    /* ─────── GET GROUPS ─────── */
    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const { data } = await API.get(`/api/MessageGroups/my-groups?ts=${Date.now()}`);
                setGroups(data);
                if (data.length > 0) setSelectedGroup(data[0]);
            } catch (error) {
                console.error('Error fetching groups:', error);
            }
        };
        fetchGroups();
    }, []);

    /* ─────── GET MESSAGES ─────── */
    const fetchMessages = useCallback(async (groupId) => {
        try {
            const { data } = await API.get(`/api/Messages/group/${groupId}?ts=${Date.now()}`);
            setMessages(data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    }, []);

    useEffect(() => {
        if (selectedGroup?.id) fetchMessages(selectedGroup.id);
    }, [selectedGroup, fetchMessages]);

    /* ─────── SEND MESSAGE ─────── */
    const handleSend = async () => {
        const trimmed = input.trim();
        if (!trimmed || !selectedGroup) return;

        try {
            const res = await API.post(`/api/Messages/group/${selectedGroup.id}`, {
                text: trimmed,
            });
            setMessages(prev => [...prev, res.data]);
            setInput('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div className="chat-wrapper">
            {/* GROUPS SIDEBAR */}
            <aside className="chat-groups">
                <h4 className="heading">Groups</h4>
                {groups.map(group => (
                    <button
                        key={group.id}
                        className={`group-btn ${selectedGroup?.id === group.id ? 'active' : ''}`}
                        onClick={() => setSelectedGroup(group)}
                    >
                        {group.name} {group.isCommon ? '🌐' : ''}
                    </button>
                ))}
            </aside>

            {/* CHAT PANEL */}
            <section className="chat-panel">
                <header className="chat-header">
                    {selectedGroup ? selectedGroup.name : 'Select a Group'}
                </header>

                <div className="chat-box">
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`chat-message ${msg.senderId === user?.id ? 'sent' : 'received'}`}
                        >
                            <span className="sender">{msg.senderName}:</span> {msg.text}
                        </div>
                    ))}
                </div>

                {selectedGroup && (
                    <div className="chat-input">
                        <input
                            type="text"
                            placeholder="Type your message…"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <button onClick={handleSend}>Send</button>
                    </div>
                )}
            </section>
        </div>
    );
}

/* ─────────── WRAPPED WITH LAYOUT ─────────── */
export default function CommonGroupChat() {
    return (
        <DashboardLayout>
            <CommonGroupChatContent />
        </DashboardLayout>
    );
}
