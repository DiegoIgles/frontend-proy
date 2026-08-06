import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the login screen at the root route', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /iniciar sesión/i })).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/correo electrónico/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/contraseña/i)).toBeInTheDocument();
});
