import { Message } from 'ai';
import { describe, expect, it } from 'vitest';
import { isFlagged } from '../is-flagged';

describe('isFlagged', () => {
  it('should return true if the message is flagged', () => {
    const message: Message = {
      role: 'user',
      id: '123123',
      content: JSON.stringify({ flagged: true }),
    };

    expect(isFlagged(message)).toBe(true);
  });

  it('should return false if the message is not flagged', () => {
    const message: Message = {
      role: 'user',
      id: '123123',
      content: JSON.stringify({ flagged: false }),
    };

    expect(isFlagged(message)).toBe(false);
  });
});
