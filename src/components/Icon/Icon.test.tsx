import { render, screen } from '@testing-library/react';
import { Icon } from './Icon';
import { FaHome } from 'react-icons/fa';

describe('Icon', () => {
  it('Should render react-icons component', () => {
    render(<Icon icon={FaHome} data-testid="react-icon" />);
    const icon = screen.getByTestId('react-icon');
    expect(icon).toBeInTheDocument();
  });

  it('Should render nothing if no props', () => {
    const { container } = render(<Icon />);
    expect(container.firstChild).toBeNull();
  });
});
