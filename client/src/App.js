import { useState } from "react";
import "./App.css";

function App() {
  const [chats, setChats] = useState([{ id: 1, name: "Chat 1", messages: [] }]);
  const [currentChatId, setCurrentChatId] = useState(1);
  const [input, setInput] = useState("");

  const handleSend = () => {
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
      // Add simulated AI response
      setTimeout(() => {
        setChats(prevChats => prevChats.map(chat => 
          chat.id === currentChatId 
            ? { ...chat, messages: [...chat.messages, { text: "Hi! How are you on", sender: "bot" }] }
            : chat
        ));
      }, 1000);
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