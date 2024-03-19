import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Login from './Components/Login/Login';

test('renders learn react link', () => {
  render(
    <Router>
      <Login />
    </Router>
  );
  const linkElement = screen.getByText(/Remember/i);
  expect(linkElement).toBeInTheDocument();
});