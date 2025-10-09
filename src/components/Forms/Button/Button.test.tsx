import { render, screen } from '@testing-library/react';
import { Button } from './Button';
import { FaHome } from 'react-icons/fa';

describe('Button', () => {
  it('Should render a label', () => {
    render(<Button label="Primary" />);
    expect(screen.getByText('Primary')).toBeInTheDocument();
  });

  it('Should render react icon', () => {
    render(<Button icon={<FaHome />} />);
    const svg = screen.getByRole('button').querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('Should render font awesome icon', () => {
    render(<Button icon="fa fa-home" />);
    const icon = screen.getByRole('button').querySelector('i');
    expect(icon).toBeInTheDocument();
  });
});
