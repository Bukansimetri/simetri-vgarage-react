import React, { useState } from 'react';
import axios from 'axios';

function VirtualAIMechanicChat({ open, onClose }) {
  const [messages, setMessages] = useState([
    { from: 'ai', text: 'Hello! I am the Virtual AI mechanic! How can I assist you with your vehicle today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { from: 'user', text: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      // Call your backend API endpoint that proxies to OpenAI (recommended for security)
      const res = await axios.post('http://localhost:5000/api/ai-chat', {
        messages: newMessages.map(m => ({
          role: m.from === 'user' ? 'user' : 'assistant',
          content: m.text
        }))
      });
      setMessages([...newMessages, { from: 'ai', text: res.data.reply }]);
    } catch (err) {
      setMessages([...newMessages, { from: 'ai', text: 'Maaf, terjadi kesalahan pada server AI.' }]);
    }
    setLoading(false);
  };

  if (!open) return null;

  return (
    <div className="ai-chat-modal-overlay" style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div className="ai-chat-modal" style={{
        background: '#fff', borderRadius: 12, width: 700, maxWidth: '90vw', padding: 20, boxShadow: '0 2px 16px #0002', height: 800, maxHeight:'90vh'
      }}>
        <h3 style={{ marginTop: 0 }}>Virtual AI Mechanic</h3>
        <div style={{
          minHeight: 630, maxHeight: 630, overflowY: 'auto', marginBottom: 12, background: '#f7f7f7', borderRadius: 8, padding: 8
        }}>
          {messages.map((msg, idx) => (
            <div key={idx} style={{
              textAlign: msg.from === 'ai' ? 'left' : 'right',
              margin: '6px 0'
            }}>
              <span style={{
                background: msg.from === 'ai' ? '#658af7' : '#DC143C',
                borderRadius: 8,
                padding: '6px 12px',
                display: 'inline-block',
                maxWidth: '80%'
              }}>
                {msg.text}
              </span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            style={{ flex: 1, borderRadius: 6, border: '1px solid #ccc', padding: 6 }}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask your question here..."
          />
          <button onClick={handleSend} style={{ borderRadius: 6, padding: '6px 16px' }}>Send</button>
        </div>
        <button onClick={onClose} style={{ marginTop: 12, float: 'right', background: '#eee', border: 'none', borderRadius: 6, padding: '6px 16px' }}>Close</button>
      </div>
    </div>
  );
}

export default VirtualAIMechanicChat;