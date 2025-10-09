import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('Should render the logo', () => {
    render(<App />);
    const logo = screen.getByAltText("Victor Hanszman's Logo");
    expect(logo).toBeInTheDocument();
  });

  it('Should render the title', () => {
    render(<App />);
    const title = screen.getByText("Hanszman's UI Design Lib");
    expect(title).toBeInTheDocument();
  });

  it('Should render the documentation paragraph', () => {
    render(<App />);
    expect(
      screen.getByText(/Check out the documentation by running the script/i),
    ).toBeInTheDocument();
  });

  it('Should render the npm run storybook code snippet', () => {
    render(<App />);
    const codeSnippet = screen.getByText('npm run storybook');
    expect(codeSnippet).toBeInTheDocument();
  });
});
