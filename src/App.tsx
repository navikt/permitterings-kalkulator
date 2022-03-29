import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import ContextProvider from './ContextProvider';
import Kalkulator from './kalkulator/kalkulator';
import { Brødsmulesti } from './Brødsmulesti';

const HOVEDSIDE_PATH = '/permittering-kalkulator';
const PERMITTERINGSSIDE_PATH = '/arbeidsgiver-permittering';

export const KALKULATOR_BRØDSMULE: any = {
    url: HOVEDSIDE_PATH,
    title: 'Kalkulator',
    handleInApp: true,
};
export const HOVEDSIDE_BRØDSMULE: any = {
    url: PERMITTERINGSSIDE_PATH,
    title: 'Arbeidsgiver permittering',
    handleInApp: true,
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
