import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { ShaderGradient, ShaderGradientCanvas } from '@shadergradient/react';
import { FiSend, FiMic, FiMicOff, FiZap, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

const API = import.meta.env.VITE_API_URL || '/api';

const SUGGESTIONS = [
  'Which drill is best for home use?',
  'Compare Bosch vs DeWalt grinders',
  'What is your return policy?',
  'Recommend tools for a carpenter',
  'Do you have cordless drills?',
  'What brands do you carry?'
];

export default function ChatbotPage() {
  const [messages, setMessages] = useState([
    { role: 'model', content: "Hey there! I'm **Bolt AI** ⚡ — your personal power tool expert at Rohit Power Tools.\n\nI can help you find the perfect tool, compare brands, check our policies, and more. What are you looking for today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [initialized, setInitialized] = useState(false); // ← track first load
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const recognitionRef = useRef(null);

  // Only scroll when NEW messages are added (not on page load)
  useEffect(() => {
    if (!initialized) {
      setInitialized(true);
      return; // Skip scroll on initial render
    }
    // Scroll only the messages container, not the whole page
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Speech-to-text
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-IN';
      recognition.onresult = (e) => {
        const transcript = Array.from(e.results).map(r => r[0].transcript).join('');
        setInput(transcript);
      };
      recognition.onend = () => setListening(false);
      recognition.onerror = () => { setListening(false); toast.error('Speech recognition error'); };
      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return toast.error('Speech recognition not supported in this browser');
    if (listening) { recognitionRef.current.stop(); setListening(false); }
    else { recognitionRef.current.start(); setListening(true); toast.success('Listening... speak now 🎙️'); }
  };

  const sendMessage = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput('');
    const newMessages = [...messages, { role: 'user', content: msg }];
    setMessages(newMessages);
    setLoading(true);

    // Build history excluding last user message (already added)
    const history = messages.map(m => ({ role: m.role, content: m.content }));
    try {
      const { data } = await axios.post(`${API}/chatbot/message`, { message: msg, history });
      setMessages(prev => [...prev, { role: 'model', content: data.message }]);
    } catch (err) {
      console.error('Chatbot error:', err);
      const errMsg = err.response?.status === 401
        ? "Please log in to use Bolt AI 🔒"
        : err.response?.status === 500
        ? "AI service is temporarily unavailable. Please check your GEMINI_API_KEY in .env and restart the backend."
        : "Sorry, I'm having trouble connecting. Please try again! 🔧";
      setMessages(prev => [...prev, { role: 'model', content: errMsg }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([{ role: 'model', content: "Chat cleared! I'm Bolt AI ⚡ — how can I help you today?" }]);
  };

  const renderMessage = (content) => content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>');

  return (
    <div style={{
      height: '100vh', display: 'flex', flexDirection: 'column',
      position: 'relative', overflow: 'hidden', marginTop: '-70px'
    }}>
      {/* Halo background */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <ShaderGradientCanvas style={{ width: '100%', height: '100%' }}>
          <ShaderGradient
            animate="on" brightness={1.2} cAzimuthAngle={180} cDistance={3.6}
            cPolarAngle={90} cameraZoom={1} color1="#ff5005" color2="#dbba95"
            color3="#d0bce1" destination="onCanvas" envPreset="city" grain="on"
            lightType="3d" pixelDensity={1} positionX={-1.4} positionY={0}
            positionZ={0} reflection={0.1} rotationX={0} rotationY={10}
            rotationZ={50} type="plane" uAmplitude={1} uDensity={1.3}
            uFrequency={5.5} uSpeed={0.4} uStrength={4} uTime={0} wireframe={false}
          />
        </ShaderGradientCanvas>
      </div>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.72)', zIndex: 1 }} />

      {/* Chat container — takes full height, flex column */}
      <div style={{
        position: 'relative', zIndex: 2,
        display: 'flex', flexDirection: 'column',
        height: '100%', maxWidth: 860,
        width: '100%', margin: '0 auto',
        padding: '0 16px'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '86px 0 16px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 48, height: 48, borderRadius: '50%',
              background: 'linear-gradient(135deg, #F97316, #fbbf24)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              animation: 'pulse-glow 2s infinite'
            }}>
              <FiZap color="white" size={22} />
            </div>
            <div>
              <h4 style={{ fontFamily: "'Poppins',sans-serif", fontSize: 18, fontWeight: 800, margin: 0, letterSpacing: 1, color: 'white' }}>BOLT AI</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e' }} />
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontFamily: "'Poppins',sans-serif" }}>Online · Powered by Gemini</span>
              </div>
            </div>
          </div>
          <button onClick={clearChat}
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '8px 16px', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
            <FiTrash2 size={13} /> Clear
          </button>
        </div>

        {/* Messages area — scrollable, flex-grow */}
        <div
          ref={messagesContainerRef}
          style={{
            flex: 1, overflowY: 'auto', overflowX: 'hidden',
            padding: '20px 0',
            display: 'flex', flexDirection: 'column', gap: 14
          }}
        >
          {/* Suggestion chips — only on first message */}
          {messages.length === 1 && (
            <div>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: "'Poppins',sans-serif", fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 }}>
                Quick questions
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {SUGGESTIONS.map(s => (
                  <button key={s} onClick={() => sendMessage(s)}
                    style={{
                      padding: '7px 14px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: 20, color: 'rgba(255,255,255,0.75)',
                      fontSize: 13, cursor: 'pointer', transition: 'all 0.2s',
                      fontFamily: "'Poppins',sans-serif"
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#F97316'; e.currentTarget.style.color = '#F97316'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'rgba(255,255,255,0.75)'; }}
                  >{s}</button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            }}>
              {msg.role === 'model' && (
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #F97316, #fbbf24)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, marginRight: 10, alignSelf: 'flex-end'
                }}>
                  <FiZap color="white" size={14} />
                </div>
              )}
              <div style={{
                maxWidth: '75%',
                padding: '12px 16px',
                borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                background: msg.role === 'user'
                  ? 'linear-gradient(135deg, #F97316, #ea6c0a)'
                  : 'rgba(255,255,255,0.07)',
                border: msg.role === 'model' ? '1px solid rgba(255,255,255,0.08)' : 'none',
                color: 'white', fontSize: 14, lineHeight: 1.7,
                fontFamily: "'Poppins',sans-serif"
              }}
                dangerouslySetInnerHTML={{ __html: renderMessage(msg.content) }}
              />
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'linear-gradient(135deg, #F97316, #fbbf24)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                <FiZap color="white" size={14} />
              </div>
              <div style={{
                background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '18px 18px 18px 4px', padding: '12px 18px',
                display: 'flex', gap: 5, alignItems: 'center'
              }}>
                {[0,1,2].map(d => (
                  <div key={d} style={{
                    width: 7, height: 7, borderRadius: '50%', background: '#F97316',
                    animation: `pulse-glow 1s ${d*0.3}s infinite`
                  }} />
                ))}
              </div>
            </div>
          )}

          {/* Scroll anchor — not used for auto-scroll anymore */}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area — fixed at bottom */}
        <div style={{ padding: '12px 0 20px', flexShrink: 0 }}>
          <div style={{
            display: 'flex', gap: 8,
            background: 'rgba(255,255,255,0.07)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 14, padding: '8px 8px 8px 16px',
            alignItems: 'flex-end'
          }}>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder="Ask about tools, brands, shipping..."
              rows={1}
              style={{
                flex: 1, background: 'none', border: 'none', outline: 'none',
                color: 'white', fontSize: 14, lineHeight: 1.6,
                resize: 'none', fontFamily: "'Poppins',sans-serif",
                maxHeight: 120, overflow: 'auto',
                paddingTop: 8, paddingBottom: 8
              }}
            />
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={toggleListening} title={listening ? 'Stop' : 'Voice input'}
                style={{
                  width: 40, height: 40, borderRadius: 10, border: 'none',
                  background: listening ? 'rgba(249,115,22,0.25)' : 'rgba(255,255,255,0.07)',
                  color: listening ? '#F97316' : 'rgba(255,255,255,0.5)',
                  cursor: 'pointer', transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                {listening ? <FiMicOff size={15} /> : <FiMic size={15} />}
              </button>
              <button onClick={() => sendMessage()} disabled={!input.trim() || loading}
                style={{
                  width: 40, height: 40, borderRadius: 10, border: 'none',
                  background: input.trim() ? '#F97316' : 'rgba(255,255,255,0.05)',
                  color: input.trim() ? 'white' : 'rgba(255,255,255,0.3)',
                  cursor: input.trim() ? 'pointer' : 'default', transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                <FiSend size={15} />
              </button>
            </div>
          </div>
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 11, marginTop: 8, fontFamily: "'Poppins',sans-serif" }}>
            Press Enter to send · Shift+Enter for new line · 🎙️ Click mic for voice input
          </p>
        </div>
      </div>
    </div>
  );
}
