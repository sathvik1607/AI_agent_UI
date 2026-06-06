# 🚀 Analytics Agent UI

A premium, React-based enterprise AI frontend for interacting with the Analytics Agent via a FastAPI backend.
Designed for operations, analytics, and business teams, featuring a clean Copilot-style multi-conversation interface.

---

## ✨ Features

* 💬 Multi-conversation interface with history tracking
* 🗂️ Persistent local storage for chats and session IDs
* ✍️ Markdown-rendered responses (tables, code blocks, lists)
* ⚡ Live Diagnostics Panel (Health & Tool Usage polling)
* 📱 Responsive, enterprise-grade dark mode UI
* 🚀 Auto-titling for new conversations

---

## 📦 Requirements

* Node.js 18+
* npm

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/sathvik1607/AI_agent_UI.git
cd AI_agent_UI
```

---

### 2. Install dependencies

```bash
npm install
```

---

## 🔑 Environment Configuration

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8000
```

⚠️ Make sure this matches your backend URL.

---

## ▶️ Run the App

```bash
npm run dev
```

App runs at:

```
http://localhost:5173
```
*(Port may vary if 5173 is in use, e.g., 5174)*

---

## 📡 API Integration

The frontend expects the backend to expose the following endpoints:

### 1. Text Chat

**POST** `/chat`

```json
{
  "message": "Hello",
  "session_id": "sess-12345..."
}
```

### 2. Health Check

**GET** `/health`
*(Polled every 5 seconds for live status)*

### 3. Tool Usage

**GET** `/tool-usage`
*(Polled every 5 seconds to display tool activity in the diagnostics panel)*

---

## 🧠 Notes

* The frontend operates entirely on text interactions; file uploads are not supported in this version.
* Ensure the backend is running before using the app to see the "Online" status indicator.
* Local chat history can be wiped by clearing your browser's local storage or using the per-chat delete button.

---

## 📄 License

MIT