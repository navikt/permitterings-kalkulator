import React from 'react';
import { render } from '@testing-library/react';
import Kalkulator from './kalkulator';

test('Tester at kalkulator renderes med basic innhold', () => {
    const { getByText } = render(<Kalkulator />);

    const permitteringsElement = getByText(
        /Legg inn permitteringsperiode for arbeidstaker/i
    );
    expect(permitteringsElement).toBeInTheDocument();

    const fraværsElement = getByText(
        /Legg inn eventuelle fravær den permitterte har hatt/i
    );
    expect(fraværsElement).toBeInTheDocument();
});
