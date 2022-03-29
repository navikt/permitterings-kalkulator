import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import './index.less';
import App from './App';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { configureDayJS } from './dayjs-config';

configureDayJS();

ReactDOM.render(
    <Suspense fallback={<NavFrontendSpinner />}>
        <App />
    </Suspense>,
    document.getElementById('root')
);
