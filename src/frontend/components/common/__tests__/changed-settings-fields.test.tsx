import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ChangedSettingsFields } from '..';

describe('<ChangedSettingsFields />', () => {
  it('renders without crashing', () => {
    render(<ChangedSettingsFields changedFields={[]} onReset={() => {}} labels={{}} />);
    expect(screen.getByText(/Changed fields:/i)).toBeInTheDocument();
  });

  it('displays changed fields correctly', () => {
    const labels = { field1: 'Field 1', field2: 'Field 2' };
    render(
      <ChangedSettingsFields
        changedFields={['field1', 'field2']}
        onReset={() => {}}
        labels={labels}
      />
    );
    expect(screen.getByText('Field 1')).toBeInTheDocument();
    expect(screen.getByText('Field 2')).toBeInTheDocument();
  });

  it('calls onReset when Reset to default is clicked', () => {
    const onResetMock = vi.fn();
    render(
      <ChangedSettingsFields
        changedFields={['field1']}
        onReset={onResetMock}
        labels={{ field1: 'Field 1' }}
      />
    );
    fireEvent.click(screen.getByText(/Reset to default/i));
    expect(onResetMock).toHaveBeenCalled();
  });

  it('handles no changed fields gracefully', () => {
    render(<ChangedSettingsFields changedFields={[]} onReset={() => {}} labels={{}} />);
    expect(screen.queryByText(/^value$/i)).not.toBeInTheDocument();
  });
});
