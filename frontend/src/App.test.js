import { render, screen } from '@testing-library/react';
import App from './App';

<<<<<<< HEAD
test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
=======
test('renders ServiGo heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/bienvenida a servigo/i);
  expect(headingElement).toBeInTheDocument();
>>>>>>> feature/navbar
});
