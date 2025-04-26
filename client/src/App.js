import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import "./App.css";
import Intro from "./Home Page/Intro";
import About from "./About Page/About";
import Contact from "./Contact Page/Contact";
import Login from "./Login/Login";
import SignUp from "./Sign Up Page/SignUp";
import Admin from "./Admin";
import Logout from "./Logout Page/Logout";
import Accounts from "./Account Page/Accounts";

function MainApp() {
  const navigate = useNavigate();
  const currentUser = localStorage.getItem("currentUser") || "";

  const [collapsed, setCollapsed] = useState(false);
  const [chats, setChats] = useState(() => {
    const saved = localStorage.getItem("chats");
    return saved ? JSON.parse(saved) : [{ id: 1, name: "Chat 1", messages: [] }];
  });
  const [currentChatId, setCurrentChatId] = useState(() => {
    const saved = localStorage.getItem("currentChatId");
    return saved ? JSON.parse(saved) : 1;
  });
  const [input, setInput] = useState("");
  const [showWelcome, setShowWelcome] = useState(() => {
    const saved = localStorage.getItem("showWelcome");
    return saved ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem("chats", JSON.stringify(chats));
  }, [chats]);
  useEffect(() => {
    localStorage.setItem("currentChatId", JSON.stringify(currentChatId));
  }, [currentChatId]);
  useEffect(() => {
    localStorage.setItem("showWelcome", JSON.stringify(showWelcome));
  }, [showWelcome]);

  const handleSend = () => {
    if (!input.trim()) return;
    setChats(chats.map(chat =>
      chat.id === currentChatId
        ? {
            ...chat,
            messages: [...chat.messages, { text: input, sender: "user" }],
            name: chat.messages.length === 0 ? input : chat.name
          }
        : chat
    ));
    setInput("");
    setShowWelcome(false);
    setTimeout(() => {
      setChats(prev => prev.map(chat =>
        chat.id === currentChatId
          ? {
              ...chat,
              messages: [...chat.messages, { text: "Mr. Marsh is the current teacher for the following courses: AP Computer Science Principles, Topics in Computer Science, and AP Computer Science A", sender: "bot" }]
            }
          : chat
      ));
    }, 1000);
  };

  const handleKeyPress = e => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNewChat = () => {
    const id = chats.length + 1;
    setChats([...chats, { id, name: `Chat ${id}`, messages: [] }]);
    setCurrentChatId(id);
    setShowWelcome(true);
  };

  const handleSwitchChat = id => {
    setCurrentChatId(id);
    const chat = chats.find(c => c.id === id);
    setShowWelcome(chat?.messages.length === 0);
  };

  const handleDeleteChat = id => {
    const updated = chats.filter(c => c.id !== id);
    setChats(updated);
    if (currentChatId === id) {
      if (updated.length) {
        setCurrentChatId(updated[0].id);
        setShowWelcome(updated[0].messages.length === 0);
      } else {
        setCurrentChatId(null);
        setShowWelcome(true);
      }
    }
  };

  const currentChat = chats.find(c => c.id === currentChatId);

  const handleInputChange = e => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <div className={`app ${collapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Sidebar toggle */}
      <button className="toggle-button" onClick={() => setCollapsed(c => !c)} aria-label="Toggle Sidebar">
        ☰
      </button>

      <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="header">
          <h1 onClick={() => navigate("/intro")} style={{ cursor: "pointer" }}>Penn Chatbot</h1>
          <button onClick={handleNewChat} className="new-chat-button">New Chat</button>
        </div>
        <div className="chat-list">
          {chats.map(chat => (
            <div key={chat.id} className="chat-item">
              <button
                className={`chat-button ${chat.id === currentChatId ? 'active' : ''}`}
                onClick={() => handleSwitchChat(chat.id)}
              >
                <span className="chat-name">{chat.name.length > 18 ? chat.name.slice(0, 18) + '...' : chat.name}</span>
              </button>
              <button onClick={() => handleDeleteChat(chat.id)} className="delete-chat-button" aria-label="Delete Chat">
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className={`chat-container ${showWelcome ? 'show-welcome' : ''}`}>        
        {showWelcome && <div className="welcome-message">Penn Chatbot</div>}
        <div className="messages">
          {currentChat?.messages.map((msg, i) => (
            <div key={i} className={`message ${msg.sender}`}>
              <div className="message-content">
                <div className="text">{msg.text}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="input-area">
          <div className="input-wrapper">
            <textarea
              className="message-input"
              rows={1}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              placeholder="Enter Message..."
            />
            <button onClick={handleSend} className="send-button">Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="app-container">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/intro" element={<Intro />} />
          <Route path="/app" element={<MainApp />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/accounts" element={<Accounts />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
