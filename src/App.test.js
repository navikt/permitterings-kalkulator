import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('Test at veiviser vises', () => {
    const { getByText } = render(<App />);
    const veiviserElement = getByText(/Veiviser/i);
    expect(veiviserElement).toBeInTheDocument();
});
