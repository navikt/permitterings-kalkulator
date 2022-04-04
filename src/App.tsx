import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import ContextProvider from './ContextProvider';
import Kalkulator from './kalkulator/kalkulator';
import { Brødsmulesti } from './Brødsmulesti';
import { Breadcrumb } from '@navikt/nav-dekoratoren-moduler';

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
            <Switch>
                <ContextProvider>
                    <Route path={HOVEDSIDE_PATH} exact={true}>
                        <Brødsmulesti
                            brødsmuler={[
                                HOVEDSIDE_BRØDSMULE,
                                KALKULATOR_BRØDSMULE,
                            ]}
                        />
                        <Kalkulator />
                    </Route>
                </ContextProvider>
            </Switch>
        </BrowserRouter>
    );
};

export default App;
