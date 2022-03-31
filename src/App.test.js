import React from 'react';
import { render } from '@testing-library/react';
import Home from './components/home/Home';

// Prueba Render Home
test('render Home', () => {
  const { getByText } = render(<Home />);
  const linkElement = getByText(/¿Quienes somos?/i);
  expect(linkElement).toBeInTheDocument();
});

