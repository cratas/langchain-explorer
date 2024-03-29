import { renderHook } from '@testing-library/react-hooks';
import { describe, it, expect } from 'vitest';
import { useMessagesScroll } from '../use-message-scroll';

describe('useMessagesScroll', () => {
  it('should scroll to bottom when messages update', () => {
    const { result, rerender } = renderHook(({ messages }) => useMessagesScroll(messages), {
      initialProps: { messages: ['message1', 'message2'] },
    });

    const mockDiv = { scrollTop: 0, scrollHeight: 100 };
    (result.current.messagesEndRef as any).current = mockDiv as any;

    rerender({ messages: ['message1', 'message2', 'message3'] });

    expect(mockDiv.scrollTop).toBe(mockDiv.scrollHeight);
  });

  it('should not scroll to bottom when messages are not updated', () => {
    const { result } = renderHook(({ messages }) => useMessagesScroll(messages), {
      initialProps: { messages: ['message1', 'message2'] },
    });

    const mockDiv = { scrollTop: 0, scrollHeight: 100 };
    (result.current.messagesEndRef as any).current = mockDiv as any;

    expect(mockDiv.scrollTop).toBe(0);
  });
});
