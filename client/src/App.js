import { useState, useEffect } from "react";
import "./App.css";
import { FaTrash } from "react-icons/fa"; // Import trash icon

function App() {
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
            ? { ...chat, messages: [...chat.messages, { text: "Hi! How are you on", sender: "bot" }] }
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

  return (
    <div className="app">
      {/* Sidebar for chat selection and creating new chats */}
      <div className="sidebar">
        <div className="header">
          <h1>ChatPHS</h1>
          <button onClick={handleNewChat} className="new-chat-button">New Chat</button>
        </div>
        <div className="chat-list">
          {chats.map(chat => (
            <div key={chat.id} className="chat-item">
              <button 
                onClick={() => handleSwitchChat(chat.id)} 
                className={`chat-button ${chat.id === currentChatId ? 'active' : ''}`}
              >
                {chat.name}
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
        {showWelcome && <div className="welcome-message">ChatPHS</div>}
        <div className="messages">
          {currentChat && currentChat.messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              <div className="message-content">
                {msg.sender === 'bot' && <div className="avatar">AI</div>}
                <div className="text">{msg.text}</div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Input area for sending messages */}
        <div className="input-area">
          <div className="input-wrapper">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Enter Message..."
            />
            <button onClick={handleSend} className="send-button">➢</button>
          </div>
          <div className="disclaimer">
            ChatPS is a simulated chat application. Do not enter any personal information.
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
