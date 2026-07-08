import { useEffect, useState } from 'react';

export function useScrollTrigger(threshold = 0): boolean {
  const [triggered, setTriggered] = useState(() => window.scrollY > threshold);

  useEffect(() => {
    const handleScroll = () => setTriggered(window.scrollY > threshold);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return triggered;
}
