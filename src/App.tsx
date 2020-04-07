import React, { useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Redirect from './Redirect';
import Permittering from './komponenter/Permittering';
import './assets/styling/dekorator-override.less';
import { skrivTilMalingBesokerSide } from './utils/amplitudeUtils';

const App = () => {
    useEffect(skrivTilMalingBesokerSide);
    return (
        <BrowserRouter>
            <div className="arbeidsgiver-permittering">
                <Switch>
                    <Redirect>
                        <Route
                            path={'/arbeidsgiver-permittering'}
                            component={Permittering}
                            exact={true}
                        />
                    </Redirect>
                </Switch>
            </div>
        </BrowserRouter>
    );
};

export default App;
