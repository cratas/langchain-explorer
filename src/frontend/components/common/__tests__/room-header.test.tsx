import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { RoomHeader } from '..';

describe('<RoomHeader />', () => {
  it('renders correctly', () => {
    const title = 'Room Title';
    render(<RoomHeader onClear={() => {}} title={title} />);
    expect(screen.getByText(title)).toBeInTheDocument();
  });

  it('displays back button when onBackText is provided', () => {
    const onBackText = 'Back';
    render(<RoomHeader onClear={() => {}} title="Room" onBackText={onBackText} />);
    expect(screen.getByText(onBackText)).toBeInTheDocument();
  });

  it('calls onBack when back button is clicked', () => {
    const onBackMock = vi.fn();
    render(<RoomHeader onBack={onBackMock} onClear={() => {}} title="Room" onBackText="Back" />);
    fireEvent.click(screen.getByText('Back'));
    expect(onBackMock).toHaveBeenCalled();
  });
});
