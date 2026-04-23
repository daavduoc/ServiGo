import { render, screen } from '@testing-library/react';
import App from './App';

test('renders ServiGo heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/bienvenida a servigo/i);
  expect(headingElement).toBeInTheDocument();
});
