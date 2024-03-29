import { renderHook, act } from '@testing-library/react-hooks';
import { describe, expect, it } from 'vitest';
import { useEnterSubmit } from '../use-enter-submit';

describe('useEnterSubmit', () => {
  it('should submit form on Enter key press', () => {
    const { result } = renderHook(() => useEnterSubmit());
    const { formRef } = result.current;
    const { onKeyDown } = result.current;

    // Mock form and its requestSubmit method
    let isSubmitted = false;
    const mockForm = {
      requestSubmit: () => {
        isSubmitted = true;
      },
    };

    (formRef as any).current = mockForm as any;

    // Simulate Enter key press
    act(() => {
      onKeyDown({
        key: 'Enter',
        shiftKey: false,
        nativeEvent: { isComposing: false },
        preventDefault: () => {},
      } as any);
    });

    expect(isSubmitted).toBe(true);
  });

  it('should not submit form on Shift+Enter key press', () => {
    const { result } = renderHook(() => useEnterSubmit());
    const { formRef } = result.current;
    const { onKeyDown } = result.current;

    // Mock form and its requestSubmit method
    let isSubmitted = false;
    const mockForm = {
      requestSubmit: () => {
        isSubmitted = true;
      },
    };
    (formRef as any).current = mockForm as any;

    // Simulate Shift+Enter key press
    act(() => {
      onKeyDown({
        key: 'Enter',
        shiftKey: true,
        nativeEvent: { isComposing: false },
        preventDefault: () => {},
      } as any);
    });

    expect(isSubmitted).toBe(false);
  });
});
