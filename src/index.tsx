import React, { Suspense } from 'react';
import * as Sentry from '@sentry/react';
import ReactDOM from 'react-dom';
import './index.less';
import App from './App';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { configureDayJS } from './dayjs-config';
import { isProduction } from './utils/env-utils';

configureDayJS();

Sentry.init({
    dsn: 'https://755254da014443dfb72b717063ba7652@sentry.gc.nav.no/72',
    environment: isProduction() ? 'production' : 'local',
    enabled: isProduction(),
});

ReactDOM.render(
    <Suspense fallback={<NavFrontendSpinner />}>
        <App />
    </Suspense>,
    document.getElementById('root')
);
