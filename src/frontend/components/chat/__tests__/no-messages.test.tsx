import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { NoMessages } from '..';

describe('<NoMessages />', () => {
  it('renders without crashing', () => {
    render(<NoMessages />);
    expect(screen.getByText('How can I help you today?')).toBeInTheDocument();
  });

  it('displays the correct text', () => {
    render(<NoMessages />);
    expect(screen.getByText('How can I help you today?')).toBeInTheDocument();
  });
});
