# Analytics Agent — Frontend

A production-grade React frontend for the **AlumnxAI Labs Analytics Agent** — an AI-powered NL2SQL platform that turns plain-English business questions into structured data reports, insights, and visualisations.

Built for operations, finance, and analytics teams who need fast answers from their database without writing SQL.

---

## What it does

Type a business question in plain English. The agent queries your database, analyzes the results, and returns:

- **Executive Summary** — a concise plain-text answer
- **Key Insights** — bullet-point highlights extracted by the engine
- **Data Table** — structured query output with column headers and rows
- **Insights Narrative** — LLM-generated observations and recommendations
- **Agent Timeline** — live step-by-step progress while the agent works

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite |
| Icons | Lucide React, React Icons |
| Markdown | react-markdown |
| State | React hooks + localStorage |
| Styling | Pure CSS variables (dark theme) |
| Backend | FastAPI (separate repo) |

---

## Architecture

The frontend follows a strict **feature-based module structure**. The monolithic entry point has been decomposed into focused files:

```
src/
├── pages/
│   └── ChatPage.jsx          # Sole orchestrator — owns all state and API calls
├── components/
│   ├── analytics/            # AnalyticsReport, AnalyticsTable, InsightsPanel,
│   │                         # AgentTimeline, AgentTimelineLoader, SqlViewer
│   ├── chat/                 # ChatWindow, MessageList, BotMessage,
│   │                         # UserMessage, SystemMessage, InputArea
│   ├── diagnostics/          # DiagnosticsPanel
│   └── sidebar/              # Sidebar, ChatHistory, ConversationItem
├── hooks/
│   ├── useConversations.js   # Multi-conversation state + localStorage sync
│   ├── useDiagnostics.js     # /health polling
│   ├── useAutoScroll.js      # Scroll-to-bottom sentinel
│   └── useLocalStorage.js    # Validated persistent state
├── services/
│   ├── apiClient.js          # Base fetch wrapper with error handling
│   └── analyticsService.js   # POST /analytics
├── utils/
│   ├── constants.js          # API base URL, storage keys, intervals
│   └── conversationUtils.js  # ID generation, title derivation, timestamps
└── types/
    └── apiSchemas.js         # JSDoc types mirroring the Python backend contract
```

**Design rules:**
- `ChatPage` is the only component that calls services or hooks — everything else is purely presentational
- No component ever calls `fetch()` directly
- Conversation IDs are generated client-side (`sess-<timestamp>-<random>`) — the backend is stateless

---

## Setup

### 1. Prerequisites

- Node.js 18+
- npm
- The Analytics Agent backend running (separate repo)

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:8000
```

Match this to wherever your FastAPI backend is running.

### 4. Start the dev server

```bash
npm run dev
```

App runs at `http://localhost:5175` by default.

---

## Backend API Contract

The frontend talks to exactly **two endpoints**:

### `POST /analytics`

Accepts a natural-language business question and returns a full analytics report.

**Request:**
```json
{ "question": "What is the total revenue for Q1 2026?" }
```

**Response:**
```json
{
  "success": true,
  "question": "What is the total revenue for Q1 2026?",
  "analysis": {
    "summary": "Total Q1 2026 revenue is ₹46,89,247.50.",
    "key_insights": ["Revenue grew 12% vs Q4 2025"],
    "output_format": "table",
    "output_title": "Q1 2026 Revenue Summary",
    "output_columns": ["Month", "Revenue"],
    "output_data": [{ "Month": "January", "Revenue": "₹14,20,310.00" }]
  },
  "insights": "INSIGHT SUMMARY\n...",
  "agent_timeline": [
    { "step": "Understanding Question", "icon": "brain", "status": "completed" },
    { "step": "Finding Relevant Data",  "icon": "search", "status": "completed" },
    { "step": "Gathering Data",         "icon": "database", "status": "completed" },
    { "step": "Analyzing Results",      "icon": "chart", "status": "completed" },
    { "step": "Generating Insights",    "icon": "lightbulb", "status": "completed" }
  ],
  "error": null
}
```

### `GET /health`

Polled every 5 seconds to drive the status indicator in the header and diagnostics panel.

```json
{ "status": "healthy" }
```

---

## Key Features

**Multi-conversation sidebar**
- Create, switch, and delete conversations
- Titles auto-derived from the first message
- Persisted in `localStorage` across page refreshes

**Live agent progress**
- While the agent works, a 5-step animated timeline shows which stage is active
- The active step pulses; the final "Generating Insights" step glows
- On completion, a lightbulb + search icon stays beside Key Insights with a 5-second glow

**Diagnostics panel**
- Toggle with the Activity icon in the sidebar footer
- Shows: backend health, session ID, last request duration

**Mobile support**
- Sidebar collapses off-screen on viewports ≤ 768px
- Hamburger menu in the header slides it back in
- Tap the dim overlay to close

---

## Notes

- Chat history is stored in `localStorage` — clearing browser storage wipes it
- The backend is fully stateless; each request is independent with no server-side session
- File uploads are not supported
- The Settings panel is coming soon

---

## License

MIT — AlumnxAI Labs
