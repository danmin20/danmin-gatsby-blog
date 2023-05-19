import { useEffect, useState } from 'react';

import { useIsomorphicLayoutEffect } from 'usehooks-ts';

type UseLockedBodyOutput = [boolean, (locked: boolean) => void];

const useLockedBody = (initialLocked = false, rootId = '___gatsby'): UseLockedBodyOutput => {
  const [locked, setLocked] = useState(initialLocked);
  const [scrollY, setScrollY] = useState(0);

  // Do the side effect before render
  useIsomorphicLayoutEffect(() => {
    if (!locked) {
      window.scrollTo({ top: scrollY });
      return;
    }

    // Save initial body style
    const originalOverflow = document.body.style.overflow;
    const originalPosition = document.body.style.position;

    // Lock body scroll
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';

    // Get the scrollBar width
    const root = document.getElementById(rootId); // or root
    const scrollBarWidth = root ? root.offsetWidth - root.scrollWidth : 0;

    // Avoid width reflow
    if (scrollBarWidth) {
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.position = originalPosition;
      document.body.scrollTo({ top: 100 });
    };
  }, [locked]);

  // Update state if initialValue changes
  useEffect(() => {
    if (locked !== initialLocked) {
      setLocked(initialLocked);
    }
  }, [initialLocked]);

  useEffect(() => {
    const handleScroll = () => {
      window.scrollY !== 0 && setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return [locked, setLocked];
};

export default useLockedBody;
