# Penn Chatbot
![penn chat bot](https://github.com/user-attachments/assets/8b557e14-9ef3-4f49-aa05-49cf99ca5e4a)

A full-stack, AI-powered chatbot for Penn High School.  
Built with a React frontend, Flask backend, and MongoDB persistence. Originally integrated with Ollama; designed to be easily migrated to OpenAI **GPT-OSS** or other open-weight models.
---

## Features

- **Chatbot**: AI-powered academic support.
- **Admin Panel**: Manage user approvals and monitor activity.
- **User Authentication**: Secure login and signup with email verification.
- **Responsive Design**: Works on all devices.
- **Modern UI**: Clean, professional interface with animations.

---

## User Experience

### Home Page
![Screenshot 2025-04-25 180014](https://github.com/user-attachments/assets/b918977b-ce95-415e-b1e6-6417bb081679)

### Chat Messaging
![Screenshot 2025-04-26 141930](https://github.com/user-attachments/assets/7fdd655f-0731-42cf-a55b-a074fac16944)

---

## Technologies Used

- **Frontend**: React.js
- **Backend**: Flask (Dockerized)
- **Database**: MongoDB

---

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-repo/penn-chatbot.git
   ```
2. **Navigate to the project directory:**
   ```bash
   cd penn-chatbot
   ```
3. **Install frontend dependencies:**
   ```bash
   cd client
   npm install
   ```
4. **Start the frontend development server:**
   ```bash
   npm start
   ```
5. **Start the backend (Docker recommended):**
   ```bash
   cd ../
   docker-compose up --build
   ```
   Or, to run Flask backend locally:
   ```bash
   cd backend
   pip install -r requirements.txt
   python main.py
   ```

---

## Image Credits

- **Background Animations**: [Unsplash](https://unsplash.com), [Pexels](https://pexels.com)
- **Icons**: [FontAwesome](https://fontawesome.com)
- **Illustrations**: [Freepik](https://freepik.com)

---

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add feature-name"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

---

## Contact

For any inquiries or feedback, please contact us at:
- **Email**: penncomuputerclub@gmail.com
- **Website**: [www.pennchatbot.com](http://localhost:3000/intro)

---

**Penn Chatbot** 🚀
