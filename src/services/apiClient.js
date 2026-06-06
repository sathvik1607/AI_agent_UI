import { API_BASE_URL } from '../utils/constants';

/**
 * Base HTTP client for the Analytics Agent backend.
 *
 * All service modules (chatService, analyticsService) call through here so that:
 *  - The base URL is configured in exactly one place (VITE_API_BASE_URL env var)
 *  - Non-2xx responses are normalised into thrown Error objects with full context
 *  - Default request headers (Content-Type) are applied consistently
 *
 * This layer is intentionally domain-agnostic — it knows nothing about
 * conversations, analytics, or chat. Domain logic lives in the service files.
 *
 * @param {string} path          - e.g. '/chat', '/analytics'
 * @param {RequestInit} options  - standard fetch options (method, body, headers…)
 * @returns {Promise<any>}       - parsed JSON response body
 * @throws {Error}               - on non-2xx HTTP status or network failure
 */
export const apiRequest = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorDetail = await response.text().catch(() => response.statusText);
    throw new Error(
      `[API] ${options.method || 'GET'} ${path} failed (${response.status}): ${errorDetail}`,
    );
  }

  return response.json();
};

/**
 * Lightweight GET helper for non-critical polling endpoints (health, tool-usage).
 * Callers are responsible for catching errors silently where appropriate.
 *
 * @param {string} path
 * @returns {Promise<any>}
 * @throws {Error} on non-2xx or network failure
 */
export const apiGet = async (path) => {
  const response = await fetch(`${API_BASE_URL}${path}`);
  if (!response.ok) throw new Error(`[API] GET ${path} returned ${response.status}`);
  return response.json();
};
