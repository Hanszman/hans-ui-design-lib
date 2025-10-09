import { render, screen } from '@testing-library/react';
import { Button } from './Button';
import { FaHome } from 'react-icons/fa';

describe('Button', () => {
  it('renders a label', () => {
    render(<Button label="Primary" />);
    expect(screen.getByText('Primary')).toBeInTheDocument();
  });

  it('renders react icon', () => {
    render(<Button icon={<FaHome />} />);
    const svg = screen.getByRole('button').querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders font awesome icon', () => {
    render(<Button icon="fa fa-home" />);
    const icon = screen.getByRole('button').querySelector('i');
    expect(icon).toBeInTheDocument();
  });
});
