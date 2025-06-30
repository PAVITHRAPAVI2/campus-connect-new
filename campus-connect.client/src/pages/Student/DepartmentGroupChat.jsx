import React, { useEffect, useState, useRef } from 'react';
import '../../Pages/Student/student style/Chat.css';
import DashboardLayout from '../../components/Styless/DashboardLayout';
import BASE_URL from '../../config';

const hdr = () => ({
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json',
});

const toCamelMsg = (m) => ({
    id: m.Id,
    content: m.Content,
    senderCollegeId: m.SenderCollegeId,
    senderRole: m.SenderRole,
    sentAt: m.SentAt,
});

function DepartmentChatInner() {
    const [profile, setProfile] = useState(null);
    const [group, setGroup] = useState(null);
    const [msgs, setMsgs] = useState([]);
    const [text, setText] = useState('');
    const chatRef = useRef(null);

    /* fetch profile */
    useEffect(() => {
        (async () => {
            const res = await fetch(`${BASE_URL}/api/Auth/profile`, { headers: hdr() });
            setProfile(await res.json());           // <-- no { data } destructure
        })();
    }, []);

    /* find department group */
    useEffect(() => {
        if (!profile) return;
        (async () => {
            const arr = await (await fetch(`${BASE_URL}/api/MessageGroups/my-groups`, { headers: hdr() })).json();
            const dept = profile.department ?? profile.Department;
            const g = arr.find((x) => !x.isCommon && (x.department ?? x.Department) === dept);
            setGroup(g || null);
            if (g) loadMsgs(g.id);
        })();
    }, [profile]);

    /* load messages */
    const loadMsgs = async (gid) => {
        const data = await (await fetch(`${BASE_URL}/api/Message/groups/${gid}/messages`, { headers: hdr() })).json();
        setMsgs(data.map(toCamelMsg));
    };

    /* send */
    const send = async () => {
        if (!text.trim() || !group) return;
        await fetch(`${BASE_URL}/api/Message/send`, {
            method: 'POST',
            headers: hdr(),
            body: JSON.stringify({ GroupId: group.id, Content: text.trim() }),
        });
        setText('');
        loadMsgs(group.id);
    };

    useEffect(() => {
        chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight });
    }, [msgs]);

    const myId = profile?.collegeId ?? profile?.CollegeId;

    return (
        <section className="chat-panel">
            <header className="chat-header">{group ? group.name : 'Department Chat'}</header>

            <div className="chat-box" ref={chatRef}>
                {msgs.map((m) => (
                    <div
                        key={m.id}
                        className={`chat-message ${m.senderCollegeId === myId ? 'sent' : 'received'}`}
                    >
                        <span className="sender">{m.senderRole}:</span> {m.content}
                    </div>
                ))}
            </div>

            <div className="chat-input">
                <input
                    value={text}
                    disabled={!group}
                    placeholder={group ? 'Type a message…' : 'No department group'}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && send()}
                />
                <button onClick={send} disabled={!group || !text.trim()}>
                    Send
                </button>
            </div>
        </section>
    );
}

export default function DepartmentChat() {
    return (
        <DashboardLayout>
            <div className="chat-wrapper">
                <DepartmentChatInner />
            </div>
        </DashboardLayout>
    );
}
