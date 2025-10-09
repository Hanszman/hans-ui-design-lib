import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders a label', () => {
    render(<Button label="Primary" />);
    expect(screen.getByText('Primary')).toBeInTheDocument();
  });
});
