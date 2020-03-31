import React from 'react';
import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Redirect from './Redirect';
import Permittering from './komponenter/Permittering';

const App = () => {
    return (
        <BrowserRouter>
            <div className="arbeidsgiver-permittering">
                <Switch>
                    <Redirect>
                        <Route path={'/arbeidsgiver-permittering'} component={Permittering} exact={true} />
                    </Redirect>
                </Switch>
            </div>
        </BrowserRouter>
    );
};

const ComponentTempHolder = () => (
    <header className="App-header">infosider til Arbeidsgiver Permittering under arbeid</header>
);

export default App;
