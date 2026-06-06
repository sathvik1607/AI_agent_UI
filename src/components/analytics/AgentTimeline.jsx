import { memo, useState, useEffect } from 'react';
import { FaLightbulb } from 'react-icons/fa';
import { RiSearchLine } from 'react-icons/ri';

/**
 * Shown after the analytics response arrives.
 *
 * Displays a composed lightbulb + magnifying glass icon (similar to
 * "intelligent search / insight discovery"). Glows for 5 seconds then
 * settles to a static teal icon — stays permanently.
 */
const AgentTimeline = memo(({ timeline }) => {
  const [glowing, setGlowing] = useState(true);

  useEffect(() => {
    if (!timeline?.length) return;
    const t = setTimeout(() => setGlowing(false), 5000);
    return () => clearTimeout(t);
  }, [timeline]);

  if (!timeline?.length) return null;

  const teal = 'var(--success)';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        padding: '1rem 1.25rem',
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        minWidth: '90px',
      }}
    >
      {/* Composed icon: lightbulb behind, magnifying glass overlaid bottom-left */}
      <div
        className={glowing ? 'agent-step-glow' : ''}
        style={{
          height: '75%',
          aspectRatio: '1 / 1',
          minHeight: '52px',
          maxHeight: '88px',
          borderRadius: '50%',
          border: `2px solid ${teal}`,
          backgroundColor: glowing ? 'rgba(20, 184, 166, 0.12)' : 'rgba(20, 184, 166, 0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          transition: 'background-color 0.6s ease, box-shadow 0.4s ease',
        }}
      >
        {/* Lightbulb — main icon */}
        <FaLightbulb
          style={{
            width: '38%',
            height: '38%',
            color: teal,
            marginBottom: '6%',
          }}
        />

        {/* Magnifying glass — overlaid bottom-left badge */}
        <div
          style={{
            position: 'absolute',
            bottom: '8%',
            left: '8%',
            backgroundColor: 'var(--card-bg)',
            borderRadius: '50%',
            padding: '2px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <RiSearchLine
            style={{
              width: '36%',
              height: '36%',
              minWidth: '12px',
              color: teal,
            }}
          />
        </div>
      </div>
    </div>
  );
});

AgentTimeline.displayName = 'AgentTimeline';
export default AgentTimeline;
