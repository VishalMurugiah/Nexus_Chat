# NexusChat :)

A modern, real-time chat application built with React and Spring Boot, featuring WebSocket communication, stunning UI/UX with futuristic design elements, and MongoDB for data persistence.

![Homepage](https://github.com/user-attachments/assets/838290b5-ef91-4bf3-bd1c-40cd0900bc90)



## Features

- **Real-time Messaging**: Instant message delivery using WebSocket (STOMP protocol)
- **Room-based Chat**: Create and join chat rooms with unique room IDs
- **Modern UI/UX**: Futuristic design with dark/light mode toggle
- **Responsive Design**: Optimized for desktop and mobile devices
- **Message History**: Persistent message storage with pagination
- **Live Connection Status**: Visual indicators for connection status
- **Animated Elements**: Smooth animations and interactive components

## Tech Stack

### Frontend
- **React 18** - Modern JavaScript library
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **SockJS & STOMP** - WebSocket communication
- **Axios** - HTTP client for API calls
- **React Hot Toast** - Beautiful notifications

### Backend
- **Spring Boot 3.4.0** - Java framework
- **Spring WebSocket** - Real-time communication
- **MongoDB** - NoSQL database
- **Maven** - Dependency management
- **Lombok** - Reduce boilerplate code

## 📸 Screenshots

### Home Page
![Home Page](path/to/home-screenshot.png) <!-- Add screenshot of JoinCreateChat component -->

### Chat Interface
![Chat Interface](path/to/chat-screenshot.png) <!-- Add screenshot of ChatPage component -->

### Dark Mode
![Dark Mode](path/to/dark-mode-screenshot.png) <!-- Add screenshot showing dark mode -->

### Mobile View
![Mobile View](path/to/mobile-screenshot.png) <!-- Add mobile responsive screenshot -->

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Java 21
- MongoDB
- Maven

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/nexuschat.git
   cd nexuschat
   ```

2. **Backend Setup**
   ```bash
   cd "Nexus Backend"
   
   # Start MongoDB service
   # Update application.properties if needed
   
   # Run the Spring Boot application
   ./mvnw spring-boot:run
   ```
   or just use Intellij IDE for easier running of the backend

3. **Frontend Setup**
   ```bash
   cd "Nexus Frontend"
   
   # Install dependencies
   npm install
   
   # Start development server
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8080

## 🏗️ Project Structure

```
NexusChat/
├── Nexus Backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/substring/chat/
│   │   │   │   ├── controllers/
│   │   │   │   ├── entities/
│   │   │   │   ├── repositories/
│   │   │   │   ├── config/
│   │   │   │   └── playload/
│   │   │   └── resources/
│   │   └── test/
│   └── pom.xml
└── Nexus Frontend/
    ├── src/
    │   ├── components/
    │   ├── config/
    │   ├── context/
    │   ├── services/
    │   └── assets/
    ├── package.json
    └── vite.config.js
```

## Configuration

### Backend Configuration
Update `application.properties`:
```properties
spring.application.name=chat-app-backend
spring.data.mongodb.uri=mongodb://localhost:27017/chatapp
```

### Frontend Configuration
Update `AxiosHelper.js` for API base URL if needed:
```javascript
export const baseURL = "http://localhost:8080";
```

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/rooms` | Create a new chat room |
| GET | `/api/v1/rooms/{roomId}` | Join/Get room details |
| GET | `/api/v1/rooms/{roomId}/messages` | Get room messages with pagination |
| GET | `/api/v1/rooms` | Get all rooms |
| DELETE | `/api/v1/rooms/{roomId}` | Delete a room |

### WebSocket Endpoints
- **Connect**: `/chat`
- **Send Message**: `/app/sendMessage/{roomId}`
- **Subscribe**: `/topic/room/{roomId}`

## Key Features Implementation

### Real-time Communication
- WebSocket connection using SockJS and STOMP protocol
- Automatic message broadcasting to room subscribers
- Connection status monitoring

### State Management
- React Context API for global state management
- Persistent chat context across components

### UI/UX Features
- Smooth animations and transitions
- Interactive particle effects
- Responsive design with mobile optimization
- Dark/Light mode toggle

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👨‍💻 Author

**Vishal Murugiah **
- GitHub: [@VishalMurugiah](https://github.com/VishalMurugiah)
- LinkedIn: [Vishal Murugiah](https://linkedin.com/in/vishal-murugiah)

## 🙏 Acknowledgments

- Spring Boot community for excellent documentation
- React team for the amazing framework
- Tailwind CSS for beautiful styling utilities
- MongoDB for reliable data storage

---

⭐ Star this repository if you found it helpful!
