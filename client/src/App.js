import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [chats, setChats] = useState(() => {
    const savedChats = localStorage.getItem("chats");
    return savedChats ? JSON.parse(savedChats) : [{ id: 1, name: "Chat 1", messages: [] }];
  });
  const [currentChatId, setCurrentChatId] = useState(() => {
    const savedCurrentChatId = localStorage.getItem("currentChatId");
    return savedCurrentChatId ? JSON.parse(savedCurrentChatId) : 1;
  });
  const [input, setInput] = useState("");

  useEffect(() => {
    localStorage.setItem("chats", JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    localStorage.setItem("currentChatId", JSON.stringify(currentChatId));
  }, [currentChatId]);

  const handleSend = async () => {
    if (input.trim()) {
      setChats(chats.map(chat => 
        chat.id === currentChatId 
          ? { 
              ...chat, 
              messages: [...chat.messages, { text: input, sender: "user" }],
              name: chat.messages.length === 0 ? input : chat.name // Set chat name if it's the first message
            }
          : chat
      ));
      setInput("");

      try {
        console.log("Sending message:", input); // Log sending message
        const response = await axios.post('/api/chat', { message: input });
        console.log("Received response:", response.data); // Log received response
        setChats(prevChats => prevChats.map(chat => 
          chat.id === currentChatId 
            ? { ...chat, messages: [...chat.messages, { text: response.data.reply, sender: "bot" }] }
            : chat
        ));
      } catch (error) {
        console.error("Error communicating with backend:", error);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSend();
      e.preventDefault();
    }
  };

  const handleNewChat = () => {
    const newChatId = chats.length + 1;
    setChats([...chats, { id: newChatId, name: `Chat ${newChatId}`, messages: [] }]);
    setCurrentChatId(newChatId);
  };

  const handleSwitchChat = (id) => {
    setCurrentChatId(id);
  };

  const currentChat = chats.find(chat => chat.id === currentChatId);

  return (
    <div className="app">
      <div className="sidebar">
        <div className="header">
          <h1>ChatPHS</h1>
          <button onClick={handleNewChat} className="new-chat-button">New Chat</button>
        </div>
        <div className="chat-list">
          {chats.map(chat => (
            <button 
              key={chat.id} 
              onClick={() => handleSwitchChat(chat.id)} 
              className={`chat-button ${chat.id === currentChatId ? 'active' : ''}`}
            >
              {chat.name}
            </button>
          ))}
        </div>
      </div>
      
      <div className="chat-container">
        <div className="messages">
          {currentChat.messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              <div className="message-content">
                {msg.sender === 'bot' && <div className="avatar">AI</div>}
                <div className="text">{msg.text}</div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="input-area">
          <div className="input-wrapper">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Enter Message..."
            />
            <button onClick={handleSend} className="send-button">
            ➢
            </button>
          </div>
          <div className="disclaimer">
          ChatPHS is a simulated chat application. Do not enter any personal information.
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;