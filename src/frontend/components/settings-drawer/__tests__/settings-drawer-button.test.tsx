import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SettingsDrawerButton } from '..';

describe('<SettingsDrawerButton />', () => {
  it('renders correctly', () => {
    render(<SettingsDrawerButton onClick={() => {}} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClickMock = vi.fn();
    render(<SettingsDrawerButton onClick={onClickMock} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClickMock).toHaveBeenCalled();
  });
});
