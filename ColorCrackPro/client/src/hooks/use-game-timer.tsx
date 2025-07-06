import { useState, useEffect } from "react";

export function useGameTimer(duration: number = 30) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          return duration; // Reset timer
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [duration]);

  const progress = (timeLeft / duration) * 100;

  return { timeLeft, progress };
}
