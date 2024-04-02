import { useCallback, useEffect, useState } from 'react';

/**
 * Hook for debouncing any value after specific delay in milliseconds
 *
 * @param value Value to be debounced
 * @param delay Delay in milliseconds after which the value is updated
 * @param debounceOnlyWhenTruthy If true, the value is only debounced when it is truthy
 * @returns Debounced value
 */
export const useDebounce = <T>(
  value: T,
  delay = 500,
  debounceOnlyWhenTruthy = false
): { debouncedValue: T; isDebouncing: boolean } => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const [isDebouncing, setIsDebouncing] = useState(false);

  const debounceValue = useCallback(() => {
    setIsDebouncing(true);

    const timer = setTimeout(() => {
      setDebouncedValue(value);
      setIsDebouncing(false);
    }, delay);

    return () => {
      clearTimeout(timer);
      setIsDebouncing(false);
    };
  }, [value, delay]);

  useEffect(() => {
    if (debounceOnlyWhenTruthy) {
      if (value) {
        return debounceValue();
      }
      setDebouncedValue(value);

      return () => {};
    }

    return debounceValue();
  }, [value, delay, debounceOnlyWhenTruthy, debounceValue]);

  return { isDebouncing, debouncedValue };
};
