import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './assets/styling/dekorator-override.less';
import ContextProvider from './komponenter/ContextProvider';
import Kalkulator from './komponenter/kalkulator/kalkulator';
import { Brødsmulesti } from './komponenter/Brødsmulesti';
import { Breadcrumb } from '@navikt/nav-dekoratoren-moduler';
import './App.less';

const HOVEDSIDE_PATH = '/permittering-kalkulator';
const PERMITTERINGSSIDE_PATH = '/arbeidsgiver-permittering';

export const KALKULATOR_BRØDSMULE: Breadcrumb = {
    url: HOVEDSIDE_PATH,
    title: 'Kalkulator',
    handleInApp: true,
};
export const HOVEDSIDE_BRØDSMULE: Breadcrumb = {
    url: PERMITTERINGSSIDE_PATH,
    title: 'Arbeidsgiver permittering',
    handleInApp: true,
};

export const App = () => {
    return (
        <BrowserRouter>
            <div className="arbeidsgiver-permittering">
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
            </div>
        </BrowserRouter>
    );
};

export default App;
