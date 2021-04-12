import React, { useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Redirect from './Redirect';
import Permittering from './komponenter/Permittering';
import './assets/styling/dekorator-override.less';
import { skrivTilMalingBesokerSide } from './utils/amplitudeUtils';
import ContextProvider from './komponenter/ContextProvider';
import Kalkulator from './komponenter/kalkulator/kalkulator';
import { Brødsmulesti } from './komponenter/Brødsmulesti';
import { Breadcrumb } from '@navikt/nav-dekoratoren-moduler';
import './App.less';

export const HOVEDSIDE_PATH = '/arbeidsgiver-permittering';
export const KALKULATOR_PATH = '/arbeidsgiver-permittering/kalkulator';

export const HOVEDSIDE_BRØDSMULE: Breadcrumb = {
    url: HOVEDSIDE_PATH,
    title: 'Veiviser for permittering',
    handleInApp: true,
};
export const KALKULATOR_BRØDSMULE: Breadcrumb = {
    url: KALKULATOR_PATH,
    title: 'Kalkulator',
    handleInApp: true,
};

const App = () => {
    useEffect(skrivTilMalingBesokerSide);
    return (
        <BrowserRouter>
            <div className="arbeidsgiver-permittering">
                <Switch>
                    <ContextProvider>
                        <Redirect>
                            <Route path={HOVEDSIDE_PATH} exact={true}>
                                <Brødsmulesti
                                    brødsmuler={[HOVEDSIDE_BRØDSMULE]}
                                />
                                <Permittering />
                            </Route>
                            <Route path={KALKULATOR_PATH} exact={true}>
                                <Brødsmulesti
                                    brødsmuler={[
                                        HOVEDSIDE_BRØDSMULE,
                                        KALKULATOR_BRØDSMULE,
                                    ]}
                                />
                                <Kalkulator />
                            </Route>
                        </Redirect>
                    </ContextProvider>
                </Switch>
            </div>
        </BrowserRouter>
    );
};

export default App;
