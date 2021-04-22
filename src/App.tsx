import React, { useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Redirect from './Redirect';
import './assets/styling/dekorator-override.less';
import { skrivTilMalingBesokerSide } from './utils/amplitudeUtils';
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
    useEffect(skrivTilMalingBesokerSide);
    return (
        <BrowserRouter>
            <div className="arbeidsgiver-permittering">
                <Switch>
                    <ContextProvider>
                        <Redirect>
                            <Route path={HOVEDSIDE_PATH} exact={true}>
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
