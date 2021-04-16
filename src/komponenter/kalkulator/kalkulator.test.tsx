import React from 'react';
import { render } from '@testing-library/react';
import ContextProvider from '../ContextProvider';
import Kalkulator from './kalkulator';
import { configureDayJS } from '../../dayjs-config';

configureDayJS();

test('Tester at kalkulator renderes med basic innhold', () => {
    const { getByText } = render(
        <ContextProvider>
            <Kalkulator />
        </ContextProvider>
    );

    const permitteringsElement = getByText(
        /Legg til periodene den ansatte har vært permittert/i
    );
    expect(permitteringsElement).toBeInTheDocument();

    const fraværsElement = getByText(
        /Legg inn eventuelle fravær under permitteringen/i
    );
    expect(fraværsElement).toBeInTheDocument();
});
