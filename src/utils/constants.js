/**
 * Application-wide constants and configuration.
 *
 * API_BASE_URL is resolved from the environment at build time via Vite.
 * Set VITE_API_BASE_URL in a .env file to point at staging or production.
 * Locally, the backend is expected on port 8000.
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const STORAGE_KEYS = {
  CONVERSATIONS: 'analytics_conversations',
  ACTIVE_CONVERSATION: 'analytics_active_conversation',
};

/** How often the diagnostics panel polls /health and /tool-usage (ms). */
export const DIAGNOSTICS_POLL_INTERVAL_MS = 5000;

/** Conversations are auto-titled from their first message, capped at this length. */
export const CHAT_TITLE_MAX_LENGTH = 40;
