import { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { FaTrash, FaArrowUp, FaBars, FaPlus } from "react-icons/fa";
import axios from "axios";
import "./App.css";

// Import components
import Intro from "./Home Page/Intro";
import About from "./About Page/About";
import Contact from "./Contact Page/Contact";
import Login from "./Login/Login";
import SignUp from "./Sign Up Page/SignUp";
import Logout from "./Logout Page/Logout";
import Accounts from "./Account Page/Accounts";


// Constants
const CONSTANTS = {
  API_BASE_URL: process.env.REACT_APP_API_URL || "http://localhost:5000",
  SIDEBAR_WIDTH: 300,
  MAX_MESSAGE_LENGTH: 2000,
  CHAT_NAME_MAX_LENGTH: 18,
  TYPING_DELAY: { MIN: 1500, MAX: 3500 },
  DEFAULT_BOT_RESPONSE: "The Computer Science classes offered at Penn include: AP Computer Science Principles, Principles of Computing, Topics in Computer Science, and AP Computer Science A"
};

// Configure axios defaults
axios.defaults.withCredentials = true;

// Utility functions

// Creates a timestamp string for messages
const formatTimestamp = (date) => {
  const now = new Date(); //Creates time of the current message
  const messageDate = new Date(date); // Converts the date string to a Date object
  const diffInMinutes = Math.floor((now - messageDate) / (1000 * 60)); //In minutes
  const diffInHours = Math.floor(diffInMinutes / 60); // In Hours
  const diffInDays = Math.floor(diffInHours / 24); // In Days

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return messageDate.toLocaleDateString();
};

// Shortents the text to a smaller length for the chat-name on the sidebar to make it more organized
const truncateText = (text, maxLength) => {
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

const generateChatId = (existingChats) => {
  return existingChats.length ? Math.max(...existingChats.map(c => c.id)) + 1 : 1;
};

// Custom hooks
const useAuth = () => {
  const [currentUser, setCurrentUser] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${CONSTANTS.API_BASE_URL}/current-user`);
        setCurrentUser(response.data.username);
        setError(null);
      } catch (err) {
        console.error("Authentication failed:", err);
        setError("Authentication failed");
        setTimeout(() => navigate("/login"), 100);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUser();
  }, [navigate]);

  return { currentUser, loading, error };
};

const useChats = (currentUser) => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch chats from server
  const fetchChats = useCallback(async () => {
    if (!currentUser) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${CONSTANTS.API_BASE_URL}/api/chats/${currentUser}`);
      const data = response.data;
      
      if (data.length > 0) {
        setChats(data);
      } else {
        setChats([{ id: 1, name: "Chat 1", messages: [] }]);
      }
    } catch (err) {
      console.error("Failed to fetch chats:", err);
      setError("Failed to load chat history");
      setChats([{ id: 1, name: "Chat 1", messages: [] }]);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  // Save chats to server
  const saveChats = useCallback(async (chatsToSave) => {
    if (!currentUser || !chatsToSave.length) return;
    
    try {
      await axios.post(`${CONSTANTS.API_BASE_URL}/api/chats/${currentUser}`, { 
        chats: chatsToSave 
      });
      setError(null);
    } catch (err) {
      console.error("Failed to save chats:", err);
      setError("Failed to save chat");
    }
  }, [currentUser]);

  // Auto-save chats when they change
  useEffect(() => {
    if (chats.length > 0) {
      const timeoutId = setTimeout(() => saveChats(chats), 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [chats, saveChats]);

  // Initial fetch
  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  return { chats, setChats, loading, error, refetch: fetchChats };
};

// Components
const LoadingSpinner = ({ message = "Loading..." }) => (
  <div className="loading-container">
    <div className="loading-spinner"></div>
    <p className="loading-text">{message}</p>
  </div>
);

const ErrorMessage = ({ message, onRetry }) => (
  <div className="error-container">
    <p className="error-text">{message}</p>
    {onRetry && (
      <button onClick={onRetry} className="retry-button">
        Try Again
      </button>
    )}
  </div>
);

const TypingIndicator = () => (
  <div className="message bot">
    <div className="avatar">
      <span>AI</span>
    </div>
    <div className="message-content">
      <div className="typing-bubble">
        <div className="typing-dots">
          <span className="typing-dot"></span>
          <span className="typing-dot"></span>
          <span className="typing-dot"></span>
        </div>
      </div>
    </div>
  </div>
);

const Message = ({ message, showTimestamp = true }) => (
  <div className={`message ${message.sender}`}>
    <div className="avatar">
      <span>{message.sender === "user" ? "U" : "AI"}</span>
    </div>
    <div className="message-content">
      <div className="text">{message.text}</div>
      {showTimestamp && (
        <div className="timestamp">
          {formatTimestamp(message.timestamp)}
        </div>
      )}
    </div>
  </div>
);

const ChatItem = ({ chat, isActive, onSelect, onDelete }) => (
  <div className="chat-item">
    <button
      className={`chat-button ${isActive ? 'active' : ''}`}
      onClick={() => onSelect(chat.id)}
      title={chat.name}
    >
      <span className="chat-name">
        {truncateText(chat.name, CONSTANTS.CHAT_NAME_MAX_LENGTH)}
      </span>
    </button>
    <button 
      onClick={() => onDelete(chat.id)} 
      className="delete-chat-button" 
      aria-label="Delete Chat"
      title="Delete Chat"
    >
      <FaTrash />
    </button>
  </div>
);

const Sidebar = ({ 
  collapsed, 
  chats, 
  currentChatId, 
  onNewChat, 
  onSelectChat, 
  onDeleteChat,
  onNavigateHome 
}) => (
  <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
    <div className="sidebar-header">
      <h1 onClick={onNavigateHome} className="app-title">
        Penn Chatbot
      </h1>
      <button onClick={onNewChat} className="new-chat-button">
        <FaPlus /> New Chat
      </button>
    </div>
    
    <div className="chat-list">
      {chats.map(chat => (
        <ChatItem
          key={chat.id}
          chat={chat}
          isActive={chat.id === currentChatId}
          onSelect={onSelectChat}
          onDelete={onDeleteChat}
        />
      ))}
    </div>
  </div>
);

const ChatInput = ({ value, onChange, onSend, disabled }) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const handleChange = (e) => {
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    onChange(e.target.value);
  };

  return (
    <div className="input-area">
      <div className="input-wrapper">
        <textarea
          className="message-input"
          rows={1}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          disabled={disabled}
          maxLength={CONSTANTS.MAX_MESSAGE_LENGTH}
        />
        <button 
          onClick={onSend} 
          className="send-button"
          disabled={disabled || !value.trim()}
          aria-label="Send message"
        >
          <FaArrowUp />
        </button>
      </div>
    </div>
  );
};

// Main Chat Application Component
function MainApp() {
  const navigate = useNavigate();
  const { currentUser, loading: authLoading, error: authError } = useAuth();
  const { chats, setChats, loading: chatsLoading, error: chatsError, refetch } = useChats(currentUser);
  
  // UI State
  const [collapsed, setCollapsed] = useState(false);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Set initial chat when chats load
  useEffect(() => {
    if (chats.length > 0 && !currentChatId) {
      setCurrentChatId(chats[0].id);
    }
  }, [chats, currentChatId]);

  // Chat operations
  const handleSendMessage = useCallback(() => {
    if (!input.trim() || isTyping) return;

    const userMessage = {
      text: input.trim(),
      sender: "user",
      timestamp: new Date().toISOString()
    };

    // Update chats with user message
    setChats(prevChats => prevChats.map(chat =>
      chat.id === currentChatId
        ? {
            ...chat,
            messages: [...chat.messages, userMessage],
            name: chat.messages.length === 0 ? input.trim() : chat.name
          }
        : chat
    ));

    setInput("");
    setIsTyping(true);

    // Simulate AI response
    const delay = Math.random() * (CONSTANTS.TYPING_DELAY.MAX - CONSTANTS.TYPING_DELAY.MIN) + CONSTANTS.TYPING_DELAY.MIN;
    
    setTimeout(() => {
      const botMessage = {
        text: CONSTANTS.DEFAULT_BOT_RESPONSE,
        sender: "bot",
        timestamp: new Date().toISOString()
      };

      setChats(prev => prev.map(chat =>
        chat.id === currentChatId
          ? {
              ...chat,
              messages: [...chat.messages, botMessage]
            }
          : chat
      ));
      
      setIsTyping(false);
    }, delay);
  }, [input, currentChatId, isTyping, setChats]);

  const handleNewChat = useCallback(() => {
    const newId = generateChatId(chats);
    const newChat = { 
      id: newId, 
      name: `Chat ${newId}`, 
      messages: [] 
    };
    
    setChats(prev => [...prev, newChat]);
    setCurrentChatId(newId);
    setIsTyping(false);
  }, [chats, setChats]);

  const handleSelectChat = useCallback((chatId) => {
    setCurrentChatId(chatId);
    setIsTyping(false);
  }, []);

  const handleDeleteChat = useCallback((chatId) => {
    const updatedChats = chats.filter(c => c.id !== chatId);
    setChats(updatedChats);
    
    if (currentChatId === chatId) {
      if (updatedChats.length > 0) {
        setCurrentChatId(updatedChats[0].id);
      } else {
        // Create a new default chat if all chats are deleted
        const defaultChat = { id: 1, name: "Chat 1", messages: [] };
        setChats([defaultChat]);
        setCurrentChatId(1);
      }
    }
    setIsTyping(false);
  }, [chats, currentChatId, setChats]);

  // Loading and error states
  if (authLoading || chatsLoading) {
    return <LoadingSpinner message="Loading Penn Chatbot..." />;
  }

  if (authError) {
    return (
      <div className="error-page">
        <h1>Authentication Required</h1>
        <p>You must be logged in to access the chatbot.</p>
        <button onClick={() => navigate("/login")} className="login-button">
          Go to Login
        </button>
      </div>
    );
  }

  const currentChat = chats.find(c => c.id === currentChatId);
  const showWelcome = !currentChat || currentChat.messages.length === 0;

  return (
    <div className={`app ${collapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Toggle Button */}
      <button 
        className="toggle-button" 
        onClick={() => setCollapsed(prev => !prev)} 
        aria-label="Toggle Sidebar"
      >
        <FaBars />
      </button>

      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        chats={chats}
        currentChatId={currentChatId}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
        onNavigateHome={() => navigate("/intro")}
      />

      {/* Main Chat Area */}
      <div className="chat-container">
        {/* Error Display */}
        {chatsError && (
          <ErrorMessage 
            message={chatsError} 
            onRetry={refetch}
          />
        )}

        
        {/* Welcome Message */}
        {showWelcome && (
          <div className="welcome-message">
          <h2> What can I help with?</h2>
          </div>
        )}

        {/* Messages */}
        <div className="messages">
          {currentChat?.messages.map((message, index) => (
            <Message key={index} message={message} />
          ))}
          
          {/* Typing Indicator */}
          {isTyping && <TypingIndicator />}
        </div>

        {/* Input Area */}
        <ChatInput
          value={input}
          onChange={setInput}
          onSend={handleSendMessage}
          disabled={isTyping}
        />
      </div>
    </div>
  );
}

// Root App Component with Router
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
          <Route path="/logout" element={<Logout />} />
          <Route path="/accounts" element={<Accounts />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;