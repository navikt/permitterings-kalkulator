import React, { useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Redirect from './Redirect';
import Permittering from './komponenter/Permittering';
import './assets/styling/dekorator-override.less';
import { skrivTilMalingBesokerSide } from './utils/amplitudeUtils';
import Context from './komponenter/Context';
import Kalkulator from './komponenter/kalkulator/kalkulator';

const App = () => {
    useEffect(skrivTilMalingBesokerSide);
    return (
        <BrowserRouter>
            <div className="arbeidsgiver-permittering">
                <Switch>
                    <Context>
                        <Redirect>
                            <Route
                                path={'/arbeidsgiver-permittering'}
                                component={Permittering}
                                exact={true}
                            />
                            <Route
                                path={
                                    '/arbeidsgiver-permittering/permittering-kalkulator'
                                }
                                component={Kalkulator}
                                exact={true}
                            />
                        </Redirect>
                    </Context>
                </Switch>
            </div>
        </BrowserRouter>
    );
};

export default App;
