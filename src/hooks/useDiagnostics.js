import { useState, useEffect } from 'react';
import { API_BASE_URL, DIAGNOSTICS_POLL_INTERVAL_MS } from '../utils/constants';

/**
 * Polls the backend's /health endpoint on a fixed cadence.
 *
 * Raw fetch is used intentionally rather than apiClient — this is a
 * fire-and-forget polling call that must never disrupt the user experience.
 *
 * The interval is torn down when the consuming component unmounts, preventing
 * memory leaks and stale-closure updates on the unmounted component.
 *
 * The exposed state is passed directly to DiagnosticsPanel and is never
 * mixed into chat message content — diagnostics are a developer-facing concern.
 *
 * NOTE: /tool-usage is not implemented in the backend. toolUsage is kept in
 * the return shape so DiagnosticsPanel wiring remains intact if the endpoint
 * is added later — it will show "—" until then.
 */
export const useDiagnostics = () => {
  const [backendHealthStatus, setBackendHealthStatus] = useState('checking…');

  useEffect(() => {
    const poll = async () => {
      try {
        const healthResponse = await fetch(`${API_BASE_URL}/health`);
        setBackendHealthStatus(healthResponse.ok ? 'Online' : 'Degraded');
      } catch {
        setBackendHealthStatus('Offline');
      }
    };

    poll(); // run immediately on mount; don't wait for the first interval
    const intervalId = setInterval(poll, DIAGNOSTICS_POLL_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, []); // API_BASE_URL is a build-time constant; no re-subscription needed

  return { backendHealthStatus, toolUsage: null };
};
