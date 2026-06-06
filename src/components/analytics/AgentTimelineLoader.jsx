import { useState, useEffect } from 'react';
import { Brain, Search, Database, BarChart2, Lightbulb, CheckCircle2 } from 'lucide-react';

const STEPS = [
  { label: 'Understanding Question', Icon: Brain },
  { label: 'Finding Relevant Data', Icon: Search },
  { label: 'Gathering Data',         Icon: Database },
  { label: 'Analyzing Results',      Icon: BarChart2 },
  { label: 'Generating Insights',    Icon: Lightbulb },
];

/**
 * Animated agent progress shown while POST /analytics is in-flight.
 *
 * Steps light up one by one every 2 seconds. The active step shows a
 * pulsing spinner; completed steps show a green check. The last step
 * stays "running" until the response arrives and this component unmounts.
 */
const AgentTimelineLoader = () => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 0,
        padding: '0.5rem 0',
        overflowX: 'auto',
      }}
    >
      {STEPS.map(({ label, Icon }, index) => {
        const isCompleted = index < activeStep;
        const isActive    = index === activeStep;
        const isPending   = index > activeStep;
        const isLast      = index === STEPS.length - 1;

        const color = isCompleted ? 'var(--success)'
                    : isActive    ? 'var(--primary)'
                    :               'var(--border)';

        return (
          <div
            key={index}
            style={{ display: 'flex', alignItems: 'center', gap: 0, flexShrink: 0 }}
          >
            {/* Step */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                minWidth: '80px',
                opacity: isPending ? 0.35 : 1,
                transition: 'opacity 0.4s ease',
              }}
            >
              {/* Icon circle */}
              <div
                className={isActive && isLast ? 'agent-step-glow' : ''}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: `2px solid ${color}`,
                  backgroundColor: isCompleted ? 'rgba(34,197,94,0.1)' : isActive ? 'rgba(20,184,166,0.12)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.4s ease',
                  position: 'relative',
                }}
              >
                {isCompleted ? (
                  <CheckCircle2 size={16} color="var(--success)" />
                ) : (
                  <Icon
                    size={16}
                    color={color}
                    className={isActive && !isLast ? 'agent-step-pulse' : ''}
                  />
                )}
              </div>

              {/* Label */}
              <span
                style={{
                  fontSize: '0.62rem',
                  color: isCompleted ? 'var(--success)' : isActive ? 'var(--primary)' : 'var(--text-muted)',
                  textAlign: 'center',
                  lineHeight: 1.3,
                  maxWidth: '72px',
                  fontWeight: isActive ? 600 : 400,
                  transition: 'color 0.4s ease',
                }}
              >
                {label}
              </span>
            </div>

            {/* Connector */}
            {!isLast && (
              <div
                style={{
                  width: '28px',
                  height: '2px',
                  backgroundColor: isCompleted ? 'var(--success)' : 'var(--border)',
                  flexShrink: 0,
                  marginBottom: '20px',
                  transition: 'background-color 0.4s ease',
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AgentTimelineLoader;
