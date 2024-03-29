import { describe, it, expect } from 'vitest';
import { Message } from 'ai';
import { formatChatHistory } from '../format-chat-history';

describe('formatChatHistory function tests', () => {
  it('formats only user messages correctly', () => {
    const chatHistory: Message[] = [
      { role: 'user', content: 'Hello', id: '123' },
      { role: 'assistant', content: 'Hi there!', id: '456' },
    ];

    const expected = 'Human: Hello\n\nAssistant: Hi there!\n';
    expect(formatChatHistory(chatHistory)).toBe(expected);
  });

  it('formats only assistant messages correctly', () => {
    const chatHistory: Message[] = [
      { role: 'assistant', content: 'Hi there!', id: '456' },
      { role: 'user', content: 'Hello', id: '123' },
    ];

    const expected = 'Assistant: Hi there!\n\nHuman: Hello\n';
    expect(formatChatHistory(chatHistory)).toBe(expected);
  });

  it('formats mixed messages correctly', () => {
    const chatHistory: Message[] = [
      { role: 'user', content: 'Hello', id: '123' },
      { role: 'assistant', content: 'Hi there!', id: '456' },
      { role: 'user', content: 'How are you?', id: '789' },
    ];

    const expected = 'Human: Hello\n\nAssistant: Hi there!\n\nHuman: How are you?\n';
    expect(formatChatHistory(chatHistory)).toBe(expected);
  });
});
