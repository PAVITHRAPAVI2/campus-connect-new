// src/Pages/Chat/GroupChat.jsx
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import DashboardLayout from '../../components/Styless/DashboardLayout';
import '../../Pages/Student/student style/Chat.css';                // reuse your existing styles

/* ───────────────────────── CONFIG ───────────────────────── */
const API = axios.create({
    baseURL: import.meta.env.VITE_API_BASE || '',           // e.g. https://campusconnect.tryasp.net
});

// attach the bearer token to every request
API.interceptors.request.use(cfg => {
    const token = localStorage.getItem('token');            // adjust key name if different
    if (token) cfg.headers.Authorization = `Bearer ${token}`;
    return cfg;
});

/* Helper to build message-specific URLs */
const MESSAGE_URL = groupId => `/api/Messages/group/${groupId}`;

/* ───────────────────────── COMPONENT ────────────────────── */
function GroupChatContent() {
    /* --------------- state --------------- */
    const [me, setMe] = useState(null);                     // current user profile
    const [groups, setGroups] = useState([]);               // array of groups user can see
    const [currentGroup, setCurrentGroup] = useState(null); // selected group object
    const [messages, setMessages] = useState([]);           // msgs in selected group
    const [text, setText] = useState('');                   // textbox value
    const [loadingMsgs, setLoadingMsgs] = useState(false);

    /* --------------- fetch profile --------------- */
    useEffect(() => {
        (async () => {
            try {
                const { data } = await API.get('/api/Auth/profile');
                setMe(data);
            } catch (err) {
                console.error('Failed to load profile', err);
            }
        })();
    }, []);

    /* --------------- fetch groups --------------- */
    useEffect(() => {
        (async () => {
            try {
                const { data } = await API.get('/api/MessageGroups/my-groups');
                setGroups(data);
                if (data.length) setCurrentGroup(data[0]);        // auto-select first group
            } catch (err) {
                console.error('Failed to load groups', err);
            }
        })();
    }, []);

    /* --------------- fetch messages for selected group --------------- */
    const loadMessages = useCallback(async (groupId) => {
        if (!groupId) return;
        setLoadingMsgs(true);
        try {
            const { data } = await API.get(MESSAGE_URL(groupId));
            setMessages(data);
        } catch (err) {
            console.error('Failed to load messages', err);
        } finally {
            setLoadingMsgs(false);
        }
    }, []);

    useEffect(() => {
        loadMessages(currentGroup?.id);
    }, [currentGroup, loadMessages]);

    /* --------------- send msg --------------- */
    const handleSend = async () => {
        const trimmed = text.trim();
        if (!trimmed || !currentGroup) return;

        const payload = { text: trimmed }; // backend adds sender & timestamp
        try {
            const { data: saved } = await API.post(MESSAGE_URL(currentGroup.id), payload);
            setMessages(prev => [...prev, saved]);
            setText('');
        } catch (err) {
            console.error('Failed to send message', err);
        }
    };

    /* --------------- ui --------------- */
    return (
        <div className="chat-wrapper">
            {/* ===== left column – groups ===== */}
            <aside className="chat-groups">
                <h4 className="heading">Groups</h4>
                {groups.map(g => (
                    <button
                        key={g.id}
                        className={`group-btn ${currentGroup?.id === g.id ? 'active' : ''}`}
                        onClick={() => setCurrentGroup(g)}
                    >
                        {g.name}{g.isCommon && ' 🌐'}
                    </button>
                ))}
            </aside>

            {/* ===== right column – messages ===== */}
            <section className="chat-panel">
                {/* header */}
                <header className="chat-header">
                    {currentGroup ? currentGroup.name : 'Select a group'}
                </header>

                {/* message list */}
                <div className="chat-box">
                    {loadingMsgs ? (
                        <div className="loader">Loading…</div>
                    ) : (
                        messages.map(m => (
                            <div
                                key={m.id}
                                className={`chat-message ${m.senderId === me?.id ? 'sent' : 'received'}`}
                            >
                                <span className="sender">{m.senderName}:</span> {m.text}
                            </div>
                        ))
                    )}
                </div>

                {/* input */}
                {currentGroup && (
                    <div className="chat-input">
                        <input
                            type="text"
                            value={text}
                            placeholder="Type a message…"
                            onChange={e => setText(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSend()}
                        />
                        <button onClick={handleSend}>Send</button>
                    </div>
                )}
            </section>
        </div>
    );
}

/* ────────────────────────── wrapper with layout ────────────────────────── */
export default function GroupChat() {
    return (
        <DashboardLayout>
            <GroupChatContent />
        </DashboardLayout>
    );
}

