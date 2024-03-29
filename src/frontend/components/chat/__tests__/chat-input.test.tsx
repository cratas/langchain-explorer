import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ChatInput } from '..';

describe('<ChatInput />', () => {
  it('renders correctly', () => {
    render(
      <ChatInput
        handleSubmit={() => {}}
        stop={() => {}}
        isLoading={false}
        input=""
        handleInputChange={() => {}}
      />
    );

    expect(screen.getByPlaceholderText('Message ...')).toBeInTheDocument();
  });

  it('calls handleSubmit on form submission', () => {
    const handleSubmitMock = vi.fn();
    render(
      <ChatInput
        handleSubmit={handleSubmitMock}
        stop={() => {}}
        isLoading={false}
        input="test"
        handleInputChange={() => {}}
      />
    );

    fireEvent.submit(screen.getByTestId('chat-input'));

    expect(handleSubmitMock).toHaveBeenCalled();
  });

  it('calls handleInputChange when input changes', () => {
    const handleInputChangeMock = vi.fn();
    render(
      <ChatInput
        handleSubmit={() => {}}
        stop={() => {}}
        isLoading={false}
        input=""
        handleInputChange={handleInputChangeMock}
      />
    );
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'new message' } });

    expect(handleInputChangeMock).toHaveBeenCalled();
  });

  it('button shows stop icon and calls stop function when isLoading is true', () => {
    const stopMock = vi.fn();
    render(
      <ChatInput
        handleSubmit={() => {}}
        stop={stopMock}
        isLoading
        input="test"
        handleInputChange={() => {}}
      />
    );

    fireEvent.click(screen.getByRole('button'));

    expect(stopMock).toHaveBeenCalled();
  });

  it('button is disabled when isLoading is false and input is empty', () => {
    render(
      <ChatInput
        handleSubmit={() => {}}
        stop={() => {}}
        isLoading={false}
        input=""
        handleInputChange={() => {}}
      />
    );

    expect(screen.getByRole('button')).toBeDisabled();
  });
});
