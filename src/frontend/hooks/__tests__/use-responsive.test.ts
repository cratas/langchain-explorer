import { renderHook } from '@testing-library/react-hooks';
import { describe, it, expect } from 'vitest';
import { useResponsive } from '../use-responsive';

describe('useResponsive', () => {
  it('should return true for "up" query when width is greater than breakpoint', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 800,
    });

    const { result } = renderHook(() => useResponsive('up', 'md'));

    expect(result.current).toBe(true);
  });

  it('should return false for "up" query when width is less than breakpoint', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 600,
    });

    const { result } = renderHook(() => useResponsive('up', 'md'));

    expect(result.current).toBe(false);
  });

  it('should return true for "down" query when width is less than breakpoint', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 600,
    });

    const { result } = renderHook(() => useResponsive('down', 'md'));

    expect(result.current).toBe(true);
  });

  it('should return false for "down" query when width is greater than breakpoint', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 800,
    });

    const { result } = renderHook(() => useResponsive('down', 'md'));

    expect(result.current).toBe(false);
  });

  it('should return true for "between" query when width is between breakpoints', () => {
    // Mock window.innerWidth
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 700,
    });

    const { result } = renderHook(() => useResponsive('between', 'sm', 'md'));

    expect(result.current).toBe(true);
  });

  it('should return false for "between" query when width is not between breakpoints', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 800,
    });

    const { result } = renderHook(() => useResponsive('between', 'sm', 'md'));

    expect(result.current).toBe(false);
  });
});
