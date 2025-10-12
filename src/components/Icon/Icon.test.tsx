import { render, screen } from '@testing-library/react';
import { Icon } from './Icon';

describe('Icon', () => {
  it('Should render icon dynamically by name', async () => {
    render(<Icon name="FaHome" data-testid="dynamic-icon" />);
    const icon = await screen.findByTestId('dynamic-icon');
    expect(icon).toBeInTheDocument();
  });

  it('Should render nothing if no name is passed', () => {
    const { container } = render(<Icon />);
    expect(container.firstChild).toBeNull();
  });
});
