import React, { FunctionComponent } from 'react';
import { Sidetittel } from 'nav-frontend-typografi';
import './banner.less';

const Banner: FunctionComponent = ({ children }) => (
    <div className="banner" role="banner" aria-roledescription="site banner">
        <div className="banner__tekst">
            <Sidetittel>{children}</Sidetittel>
        </div>
        <div className="banner__bunnlinje" />
    </div>
);

export default Banner;
