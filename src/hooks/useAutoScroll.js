import { useRef, useEffect } from 'react';

/**
 * Attaches a sentinel ref to the bottom of a scrollable list and automatically
 * scrolls it into view whenever the provided dependencies change.
 *
 * Usage: attach the returned ref to an empty <div> placed at the very end of
 * the message list. Pass [messages, isLoading] as deps so the view scrolls on
 * new messages and when the typing indicator appears or disappears.
 *
 * @param {readonly any[]} deps - values that should trigger a scroll
 * @returns {React.RefObject<HTMLDivElement>}
 */
export const useAutoScroll = (deps = []) => {
  const sentinelRef = useRef(null);

  useEffect(() => {
    sentinelRef.current?.scrollIntoView({ behavior: 'smooth' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return sentinelRef;
};
