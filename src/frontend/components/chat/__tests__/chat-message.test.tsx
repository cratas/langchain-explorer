import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Message } from 'ai';
import { ChatMessage } from '..';

describe('<ChatMessage />', () => {
  const testMessage: Message = { content: 'Test message', role: 'user', id: '123' };

  it('renders correctly with a message', () => {
    render(<ChatMessage message={testMessage} />);
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('displays the correct role', () => {
    render(<ChatMessage message={{ ...testMessage, role: 'assistant' }} />);
    expect(screen.getByText('AI Assistant')).toBeInTheDocument();
  });

  it('displays message type correctly', () => {
    render(<ChatMessage message={testMessage} type="chatgpt" />);
    expect(screen.getByText('ChatGPT')).toBeInTheDocument();
  });

  it('shows loading spinner when isLoading is true', () => {
    render(<ChatMessage message={testMessage} isLoading />);

    expect(screen.getByTestId('test-loading-spinner')).toBeInTheDocument();
  });

  it('renders comparison button when provided', () => {
    const comparisonButton = <button type="button">Compare</button>;
    render(<ChatMessage message={testMessage} comparasionButton={comparisonButton} />);
    expect(screen.getByText('Compare')).toBeInTheDocument();
  });
});
