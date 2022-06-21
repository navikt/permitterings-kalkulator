import React from 'react';
import Kalkulator from './kalkulator/kalkulator';
import { Brødsmulesti } from './Brødsmulesti';
import { Breadcrumb } from '@navikt/nav-dekoratoren-moduler';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

const HOVEDSIDE_PATH = '/permittering-kalkulator';
const PERMITTERINGSSIDE_PATH =
    'https://arbeidsgiver.nav.no/permittering-og-omstilling';

export const KALKULATOR_BRØDSMULE: Breadcrumb = {
    url: HOVEDSIDE_PATH,
    title: 'Kalkulator',
    handleInApp: true,
};

export const HOVEDSIDE_BRØDSMULE: Breadcrumb = {
    url: PERMITTERINGSSIDE_PATH,
    title: 'Permittering og omstilling',
    handleInApp: false,
};

export const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path={HOVEDSIDE_PATH}
                    element={
                        <>
                            <Brødsmulesti
                                brødsmuler={[
                                    HOVEDSIDE_BRØDSMULE,
                                    KALKULATOR_BRØDSMULE,
                                ]}
                            />
                            <Kalkulator />
                        </>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
