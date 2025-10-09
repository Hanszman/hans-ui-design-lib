import { render, screen } from '@testing-library/react';
import { Icon } from './Icon';
import { FaHome } from 'react-icons/fa';

describe('Icon', () => {
  it('renders react-icons component', () => {
    render(<Icon icon={FaHome} data-testid="react-icon" />);
    const icon = screen.getByTestId('react-icon');
    expect(icon).toBeInTheDocument();
  });

  it('renders font-awesome string', () => {
    render(<Icon name="fa fa-home" data-testid="fa-icon" />);
    const icon = screen.getByTestId('fa-icon');
    expect(icon).toBeInTheDocument();
  });

  it('renders nothing if no props', () => {
    const { container } = render(<Icon />);
    expect(container.firstChild).toBeNull();
  });
});
