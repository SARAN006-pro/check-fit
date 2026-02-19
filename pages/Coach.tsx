
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import Header from '../components/layout/Header';
import { 
  Send, 
  Sparkles, 
  Zap, 
  Dumbbell, 
  Brain, 
  Bot,
  User as UserIcon,
  RefreshCw,
  Terminal,
  ShieldCheck,
  ChevronLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ChatMessage } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const Coach: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: "System initialized. Zenith CTRL at your disposal. Provide parameters for optimization.",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Persist chat session to maintain context
  const chatSessionRef = useRef<Chat | null>(null);

  const suggestions = [
    { text: "Analyze performance delta", icon: <Terminal className="w-3.5 h-3.5" /> },
    { text: "Optimization protocol: HIIT", icon: <Zap className="w-3.5 h-3.5" /> },
    { text: "Biometric recovery audit", icon: <Brain className="w-3.5 h-3.5" /> },
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const getChatSession = () => {
    if (!chatSessionRef.current) {
      chatSessionRef.current = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: 'You are ZENITH CTRL, the master control AI for the ZenFit ecosystem. Your role is to analyze biometric data, training logs, and nutrition parameters to provide high-precision optimization advice. Tone: Scientific, concise, professional, and technical. Use terms like "protocol," "parameters," "delta," and "optimization." You are the brain of a premium performance SaaS.',
        }
      });
    }
    return chatSessionRef.current;
  };

  const handleSend = async (overrideText?: string) => {
    const textToSend = overrideText || input;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: textToSend,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const chat = getChatSession();
      const responseStream = await chat.sendMessageStream({ message: textToSend });
      
      const modelMsgId = (Date.now() + 1).toString();
      let fullText = "";
      
      setMessages(prev => [...prev, {
        id: modelMsgId,
        role: 'model',
        text: "",
        timestamp: new Date().toISOString()
      }]);

      for await (const chunk of responseStream) {
        fullText += chunk.text;
        setMessages(prev => prev.map(m => m.id === modelMsgId ? { ...m, text: fullText } : m));
      }
    } catch (error) {
      console.error("Zenith CTRL Sync Error:", error);
      setMessages(prev => [...prev, {
        id: 'err-' + Date.now(),
        role: 'model',
        text: "Signal degradation detected. Re-initialize protocol.",
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-zinc-950 text-zinc-100 animate-in fade-in duration-1000 overflow-hidden">
      {/* CTRL Header */}
      <div className="p-6 border-b border-white/5 bg-zinc-900/50 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-black tracking-[0.2em] uppercase text-white flex items-center gap-2">
              Zenith CTRL
              <span className="inline-block w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_#3b82f6]" />
            </h1>
            <div className="flex items-center gap-2 mt-0.5">
              <ShieldCheck className="w-3 h-3 text-zinc-500" />
              <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Neural Bridge Active • v4.2.0-Stable</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end mr-2">
            <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest leading-none">Core Load</span>
            <span className="text-[10px] font-black text-blue-400 mt-1">12.4ms</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
             <Terminal className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Terminal Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent"
      >
        {messages.map((msg) => (
          <div 
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-4 duration-500`}
          >
            <div className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
                msg.role === 'user' 
                  ? 'bg-zinc-800 border-white/10 text-zinc-400' 
                  : 'bg-blue-600 border-blue-400 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]'
              }`}>
                {msg.role === 'user' ? <UserIcon className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>
              
              <div className={`p-5 rounded-[28px] text-sm font-medium leading-relaxed shadow-2xl ${
                msg.role === 'user' 
                  ? 'bg-zinc-900 text-zinc-300 border border-white/5 rounded-tr-none' 
                  : 'bg-zinc-800/50 text-white border border-blue-500/20 rounded-tl-none backdrop-blur-sm'
              }`}>
                {msg.text || (msg.role === 'model' && !isTyping ? "SYNCHRONIZING..." : "")}
              </div>
            </div>
          </div>
        ))}
        {isTyping && !messages[messages.length - 1].text && (
          <div className="flex justify-start">
            <div className="flex gap-4 items-center animate-pulse">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-500">
                <RefreshCw className="w-5 h-5 animate-spin" />
              </div>
              <div className="p-5 bg-zinc-900 border border-white/5 rounded-[28px] rounded-tl-none">
                <div className="flex gap-1.5">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Logic Input Area */}
      <div className="p-6 md:p-10 bg-zinc-900/50 border-t border-white/5">
        <div className="max-w-3xl mx-auto space-y-6">
          {!isTyping && (
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(s.text)}
                  className="flex items-center gap-2 px-5 py-3 bg-zinc-800/50 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:border-blue-500/50 hover:bg-blue-500/10 transition-all whitespace-nowrap"
                >
                  {s.icon}
                  {s.text}
                </button>
              ))}
            </div>
          )}

          <div className="relative group">
            <div className="absolute inset-0 bg-blue-500/5 rounded-[32px] blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
            <div className="relative bg-zinc-950 border border-white/10 rounded-[32px] p-2.5 flex items-center gap-3 shadow-3xl focus-within:border-blue-500/50 transition-all">
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Query Zenith CTRL System..."
                className="flex-1 bg-transparent border-none px-6 py-4 text-sm font-bold text-white placeholder:text-zinc-600 outline-none"
              />
              <button 
                onClick={() => handleSend()}
                disabled={!input.trim() || isTyping}
                className={`w-14 h-14 rounded-[22px] flex items-center justify-center transition-all ${
                  input.trim() && !isTyping 
                    ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:scale-105 active:scale-95' 
                    : 'bg-zinc-800 text-zinc-600'
                }`}
              >
                <Send className="w-6 h-6" strokeWidth={2.5} />
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-3 opacity-30">
            <Sparkles className="w-3 h-3 text-blue-400" />
            <p className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.5em]">Zenith Neural Core • Brooklyn-Node-22</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Coach;
