'use client';

import { useEffect, useState } from 'react';

type Query = 'up' | 'down' | 'between';
type BreakPoints = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

/**
 * A hook for responsive design, allowing components to adapt based on the viewport width.
 * It evaluates media query-like conditions ('up', 'down', 'between') against specified breakpoints.
 */
export const useResponsive = (query: Query, start: BreakPoints, end?: BreakPoints) => {
  const [width, setWidth] = useState(0);

  const handleWindowSizeChange = () => setWidth(window.innerWidth);

  useEffect(() => {
    handleWindowSizeChange();

    window.addEventListener('resize', handleWindowSizeChange);

    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, []);

  const calculateQuery = (innerQuery: Query, innerStart: BreakPoints, innerEnd?: BreakPoints) => {
    switch (innerQuery) {
      case 'up':
        return width >= BREAKPOINTS[innerStart];
      case 'down':
        return width <= BREAKPOINTS[innerStart];
      case 'between':
        return BREAKPOINTS[innerStart] <= width && width <= BREAKPOINTS[innerEnd!];
      default:
        return null;
    }
  };

  return width === 0 ? null : calculateQuery(query, start, end);
};
