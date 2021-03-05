import React from 'react';
import { render } from '@testing-library/react';
import ContextProvider from '../ContextProvider';
import Kalkulator from './kalkulator';

test('Tester at kalkulator renderes med basic innhold', () => {
    const { getByText } = render(
        <ContextProvider>
            <Kalkulator />
        </ContextProvider>
    );

    const permitteringsElement = getByText(
        /Legg inn permitteringsperiode for arbeidstaker/i
    );
    expect(permitteringsElement).toBeInTheDocument();

    const fraværsElement = getByText(
        /Legg inn eventuelle fravær den permitterte har hatt/i
    );
    expect(fraværsElement).toBeInTheDocument();
});
