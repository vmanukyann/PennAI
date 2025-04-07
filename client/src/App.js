import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import { FaTrash, FaCog } from "react-icons/fa"; // Import trash and settings icons
import Intro from "./Intro";
import About from "./About";
import Contact from "./Contact";
import Login from "./Login";
import SignUp from "./SignUp";
import Admin from "./Admin"; 
import Logout from "./Logout"; // Import Logout component

function NavBar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("currentUser"); // Clear the current user
    localStorage.removeItem("lastLoginTime"); // Clear the login timestamp
    navigate("/login"); // Redirect to the login page
  };

  return (
    <nav className="navbar">
      <div className="nav-logo" onClick={() => navigate("/intro")}>Penn Chatbot</div>
      <ul className="nav-links">
        <li><button onClick={() => navigate("/login")} className="nav-button">Login</button></li>
        <li><button onClick={() => navigate("/signup")} className="nav-button">Sign Up</button></li>
        <li><button onClick={handleLogout} className="nav-button">Logout</button></li>
      </ul>
    </nav>
  );
}

function MainApp() {
  const navigate = useNavigate();
  const currentUser = localStorage.getItem("currentUser") || ""; // Get the current user's email

  // Function to extract the first two letters of the email
  const getUserAvatarText = (email) => {
    return email.slice(0, 2).toUpperCase(); // Take the first two letters and convert to uppercase
  };

  // State to manage chat sessions
  const [chats, setChats] = useState(() => {
    const savedChats = localStorage.getItem("chats");
    return savedChats ? JSON.parse(savedChats) : [{ id: 1, name: "Chat 1", messages: [] }];
  });
  const [currentChatId, setCurrentChatId] = useState(() => {
    const savedCurrentChatId = localStorage.getItem("currentChatId");
    return savedCurrentChatId ? JSON.parse(savedCurrentChatId) : 1;
  });
  const [input, setInput] = useState(""); // Stores the input text
  const [showWelcome, setShowWelcome] = useState(() => {
    const savedShowWelcome = localStorage.getItem("showWelcome");
    return savedShowWelcome ? JSON.parse(savedShowWelcome) : true;
  }); // State to manage welcome message visibility

  // Save chats to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("chats", JSON.stringify(chats));
  }, [chats]);

  // Save current chat ID to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("currentChatId", JSON.stringify(currentChatId));
  }, [currentChatId]);

  // Save showWelcome to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("showWelcome", JSON.stringify(showWelcome));
  }, [showWelcome]);

  // Function to send a message
  const handleSend = () => {
    if (input.trim()) {
      // Update the chats state by adding the new message
      setChats(chats.map(chat => 
        chat.id === currentChatId 
          ? { 
              ...chat, 
              messages: [...chat.messages, { text: input, sender: "user" }],
              name: chat.messages.length === 0 ? input : chat.name // Set chat name if it's the first message
            }
          : chat
      ));
      setInput(""); // Clear input field
      setShowWelcome(false); // Hide welcome message
      
      // Simulate an AI response after a delay
      setTimeout(() => {
        setChats(prevChats => prevChats.map(chat => 
          chat.id === currentChatId 
            ? { ...chat, messages: [...chat.messages, { text: "Mrs. Tippett is the current teacher of AP Computer Science Principles", sender: "bot" }] }
            : chat
        ));
      }, 1000);
    }
  };

  // Handle 'Enter' key press to send message
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSend();
      e.preventDefault(); // Prevent new line
    }
  };

  // Function to create a new chat session
  const handleNewChat = () => {
    const newChatId = chats.length + 1;
    setChats([...chats, { id: newChatId, name: `Chat ${newChatId}`, messages: [] }]);
    setCurrentChatId(newChatId); // Switch to new chat
    setShowWelcome(true); // Show welcome message for new chat
  };

  // Function to switch between chat sessions
  const handleSwitchChat = (id) => {
    setCurrentChatId(id);
    setShowWelcome(chats.find(chat => chat.id === id).messages.length === 0); // Show welcome message if chat is empty
  };

  // Function to delete a chat session
  const handleDeleteChat = (id) => {
    const updatedChats = chats.filter(chat => chat.id !== id);
    setChats(updatedChats);
    if (currentChatId === id && updatedChats.length > 0) {
      setCurrentChatId(updatedChats[0].id);
      setShowWelcome(updatedChats[0].messages.length === 0); // Show welcome message if chat is empty
    } else if (updatedChats.length === 0) {
      setCurrentChatId(null);
      setShowWelcome(true); // Show welcome message if no chats are left
    }
  };

  // Get the current active chat
  const currentChat = chats.find(chat => chat.id === currentChatId);

  const handleInputChange = (e) => {
    setInput(e.target.value);
    e.target.style.height = "auto"; // Reset height
    e.target.style.height = `${e.target.scrollHeight}px`; // Adjust height dynamically
  };

  // Function to truncate chat names
  const truncateChatName = (name) => {
    if (name.length > 18) {
      return name.substring(0, 18) + "...";
    }
    return name;
  };

  return (
    <div className="app">
      {/* Sidebar for chat selection and creating new chats */}
      <div className="sidebar">
        <div className="header">
          <h1 onClick={() => navigate("/intro")} style={{ cursor: "pointer" }}>Penn Chatbot</h1> {/* Redirect to intro */}
          <button onClick={handleNewChat} className="new-chat-button">New Chat</button>
        </div>
        <div className="chat-list">
          {chats.map(chat => (
            <div key={chat.id} className="chat-item">
              <button 
                onClick={() => handleSwitchChat(chat.id)} 
                className={`chat-button ${chat.id === currentChatId ? 'active' : ''}`}
              >
                <span className="chat-name">{truncateChatName(chat.name)}</span>
              </button>
              <button 
                onClick={() => handleDeleteChat(chat.id)} 
                className="delete-chat-button"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      </div>
      
      {/* Chat container where messages are displayed */}
      <div className="chat-container">
        {showWelcome && <div className="welcome-message">Penn Chatbot</div>}
        <div className="messages">
          {currentChat && currentChat.messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              <div className="message-content">
                {msg.sender === 'bot' && <div className="avatar">AI</div>}
                {msg.sender === 'user' && (
                  <div className="avatar">
                    {getUserAvatarText(currentUser)}
                  </div>
                )}
                <div className="text">{msg.text}</div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Input area for sending messages */}
        <div className="input-area">
          <div className="input-wrapper">
            <textarea
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              placeholder="Enter Message..."
              rows="1" // Start with one row
              className="message-input"
            />
            <button onClick={handleSend} className="send-button">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark"; // Load theme from localStorage
  });

  useEffect(() => {
    document.body.className = darkMode ? "dark-mode" : "light-mode"; // Apply theme class to body
    localStorage.setItem("theme", darkMode ? "dark" : "light"); // Save theme to localStorage
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode((prevMode) => !prevMode); // Toggle theme
  };

  return (
    <div className="app-container"> {/* Add a container for consistent layout */}
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/intro" element={<Intro />} /> {/* Add route for intro */}
          <Route path="/app" element={<MainApp />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} /> {/* Add admin route */}
          <Route path="/logout" element={<Logout />} /> {/* Add logout route */}
        </Routes>
      </Router>
      <button className="settings-button" onClick={toggleTheme}>
        <FaCog />
      </button>
    </div>
  );
}

export default App;
