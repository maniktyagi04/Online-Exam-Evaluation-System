import { useState, useEffect, useRef, useCallback } from 'react';

interface UseTimerOptions {
  durationMinutes: number;
  onExpire?: () => void;
}

interface UseTimerReturn {
  secondsLeft: number;
  formatted: string;
  urgency: 'normal' | 'warning' | 'danger';
  isExpired: boolean;
}

export const useTimer = ({ durationMinutes, onExpire }: UseTimerOptions): UseTimerReturn => {
  const [secondsLeft, setSecondsLeft] = useState(durationMinutes * 60);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  useEffect(() => {
    if (secondsLeft <= 0) {
      onExpireRef.current?.();
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(interval);
          onExpireRef.current?.();
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatted = useCallback(() => {
    const m = Math.floor(secondsLeft / 60);
    const s = secondsLeft % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }, [secondsLeft])();

  const totalSeconds = durationMinutes * 60;
  const urgency =
    secondsLeft <= 60
      ? 'danger'
      : secondsLeft <= totalSeconds * 0.2
      ? 'warning'
      : 'normal';

  return { secondsLeft, formatted, urgency, isExpired: secondsLeft <= 0 };
};
