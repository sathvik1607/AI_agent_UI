import ChatPage from './pages/ChatPage';
import './index.css';

/**
 * Application root — intentionally thin.
 *
 * App.jsx is the Vite entry point (mounted by main.jsx) and its sole
 * responsibility is mounting the top-level page. All business logic,
 * state management, and API communication lives in ChatPage and below.
 *
 * To add routing in the future:
 *   1. npm install react-router-dom
 *   2. Wrap this return with <BrowserRouter> and <Routes>
 *   3. Keep App.jsx as the routing shell only — no business logic here
 */
const App = () => <ChatPage />;

export default App;
