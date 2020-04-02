import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './index.less';
import App from './App';
import NavFrontendSpinner from 'nav-frontend-spinner';

ReactDOM.render(
    <Suspense fallback={<NavFrontendSpinner />}>
        <App />
    </Suspense>,
    document.getElementById('root')
);
