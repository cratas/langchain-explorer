import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { InputWhisperer } from '../input-whisperer';

describe('<InputWhisperer />', () => {
  it('renders and displays proposals with typewriter effect', async () => {
    const proposals = ['Suggestion 1', 'Suggestion 2'];
    render(<InputWhisperer proposals={proposals} />);

    expect(await screen.findByText(proposals[0])).toBeInTheDocument();
  });

  it('hides the component when the close button is clicked', () => {
    const proposals = ['Suggestion 1', 'Suggestion 2'];
    render(<InputWhisperer proposals={proposals} />);

    fireEvent.click(screen.getByRole('button'));

    expect(screen.queryByText(proposals[0])).not.toBeInTheDocument();
  });
});
