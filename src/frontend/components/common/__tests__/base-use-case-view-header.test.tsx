import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BaseUseCaseViewHeader } from '../base-use-case-view-header';

describe('BaseUseCaseViewHeader', () => {
  it('should render title, description, and chips', () => {
    render(
      <BaseUseCaseViewHeader
        chipItems={['chip1', 'chip2']}
        title="Test Title"
        description="Test Description"
        settingsItems={[
          {
            label: 'Setting 1',
            value: 'Value 1',
            tooltipContent: 'Tooltip 1',
          },
          {
            label: 'Setting 2',
            value: 'Value 2',
            tooltipContent: 'Tooltip 2',
          },
        ]}
      />
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('chip1')).toBeInTheDocument();
    expect(screen.getByText('chip2')).toBeInTheDocument();
    expect(screen.getByText('Setting 1')).toBeInTheDocument();
    expect(screen.getByText('Value 1')).toBeInTheDocument();
    expect(screen.getByText('Setting 2')).toBeInTheDocument();
    expect(screen.getByText('Value 2')).toBeInTheDocument();
  });

  it('should render button when buttonText and buttonLinkURL are provided', () => {
    render(
      <BaseUseCaseViewHeader
        chipItems={['chip1', 'chip2']}
        title="Test Title"
        description="Test Description"
        buttonText="Test Button"
        buttonLinkURL="https://example.com"
        settingsItems={[
          {
            label: 'Setting 1',
            value: 'Value 1',
            tooltipContent: 'Tooltip 1',
          },
          {
            label: 'Setting 2',
            value: 'Value 2',
            tooltipContent: 'Tooltip 2',
          },
        ]}
      />
    );

    expect(screen.getByText('Test Button')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Test Button' })).toHaveAttribute(
      'href',
      'https://example.com'
    );
  });

  it('should not render button when buttonText and buttonLinkURL are not provided', () => {
    render(
      <BaseUseCaseViewHeader
        chipItems={['chip1', 'chip2']}
        title="Test Title"
        description="Test Description"
        settingsItems={[
          {
            label: 'Setting 1',
            value: 'Value 1',
            tooltipContent: 'Tooltip 1',
          },
          {
            label: 'Setting 2',
            value: 'Value 2',
            tooltipContent: 'Tooltip 2',
          },
        ]}
      />
    );

    expect(screen.queryByText('Test Button')).not.toBeInTheDocument();
  });
});
