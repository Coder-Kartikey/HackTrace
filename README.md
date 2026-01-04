# HackTrace 🔍

A powerful error tracing and debugging SDK with a beautiful web dashboard for tracking and analyzing function execution flows in JavaScript/TypeScript applications. 

🌐 **Live Demo**: [hacktrace.pages.dev](https://hacktrace.pages.dev/)

## 📋 Overview

HackTrace is a comprehensive debugging and monitoring solution that helps developers: 
- Track function execution flows in real-time
- Capture and analyze errors with detailed stack traces
- Visualize performance metrics and execution timelines
- Debug complex asynchronous code paths
- Monitor application behavior in development and production

## ✨ Features

- 🎯 **Easy Integration** - Simple SDK with minimal setup
- 📊 **Visual Dashboard** - Beautiful React-based UI for analyzing traces
- ⚡ **Async/Sync Support** - Handles both synchronous and asynchronous functions
- 🔍 **Detailed Stack Traces** - File, line, and column information for each trace
- ⏱️ **Performance Metrics** - Track execution duration for each function
- 🎨 **Modern UI** - Built with React 19, Tailwind CSS, and Recharts
- 🔌 **RESTful API** - Express-based backend with MongoDB storage
- 🎪 **Demo App** - Example implementation to get started quickly

## 🏗️ Architecture

The project consists of four main components:

```
HackTrace/
├── sdk/          # JavaScript SDK for tracing functions
├── server/       # Express backend API
├── client/       # React frontend dashboard
└── demo-app/     # Example application
```

### Technology Stack

**Frontend (Client)**
- React 19.2.0
- TypeScript
- Vite
- Tailwind CSS 4.x
- React Router 7.x
- Recharts (for visualizations)
- Lucide React (icons)

**Backend (Server)**
- Node.js
- Express 5.x
- MongoDB with Mongoose
- Google GenAI
- CORS enabled

**SDK**
- Vanilla JavaScript
- Zero dependencies
- Axios for API communication

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB instance
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Coder-Kartikey/HackTrace.git
cd HackTrace
```

2. **Install dependencies**

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install

# Install demo-app dependencies
cd ../demo-app
npm install
```

3. **Configure environment variables**

Create a `.env` file in the `server` directory:
```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

4. **Start the services**

```bash
# Terminal 1 - Start the backend server
cd server
node index.js

# Terminal 2 - Start the frontend client
cd client
npm run dev

# Terminal 3 - Run the demo app (optional)
cd demo-app
node app.js
```

## 📖 Usage

### SDK Integration

1. **Import the SDK**
```javascript
const { startTrace, stopTrace, traceFn } = require('./sdk/hacktrace');
```

2. **Start a trace session**
```javascript
startTrace({
  label: "My Application Flow"
});
```

3. **Wrap your functions**
```javascript
const myFunction = traceFn("myFunction", async () => {
  // Your function logic here
  await someAsyncOperation();
});
```

4. **Handle errors and send traces**
```javascript
try {
  await myFunction();
} catch (err) {
  const payload = stopTrace();
  
  await axios.post("http://localhost:5000/api/traces", {
    trace: payload.trace,
    session: payload.session,
    source: "my-app"
  });
}
```

## 📊 Dashboard Features

- **Trace List View**: Browse all captured traces with filtering options
- **Trace Detail View**:  Detailed view of individual traces with: 
  - Function call hierarchy
  - Execution timeline
  - Performance metrics
  - Error details with stack traces
  - File and line number information

## 🛠️ Development

### Client Development

```bash
cd client
npm run dev      # Start dev server
npm run build    # Build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

### Server Development

```bash
cd server
node index.js    # Start server on port 5000
```

## 📝 API Endpoints

### POST `/api/traces`
Create a new trace record

**Request Body:**
```json
{
  "session": {
    "id": "session-1234567890",
    "label": "My Session"
  },
  "trace": {
    "stack": [... ],
    "totalDuration": 150,
    "errorMessage": "Error description"
  },
  "source": "my-app"
}
```

### GET `/api/traces`
Retrieve all traces

### GET `/api/traces/:id`
Get a specific trace by ID

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source

## 👤 Author

**CoderKP**
- GitHub: [@Coder-Kartikey](https://github.com/Coder-Kartikey)

## 📞 Support

If you have any questions or need help, please open an issue in the GitHub repository. 

---

Made with ❤️ by CoderKP
