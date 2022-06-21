import React, { FunctionComponent } from 'react';
import { Sidetittel } from 'nav-frontend-typografi';
import './banner.less';

const Banner: FunctionComponent = () => (
    <div className="banner" role="banner" aria-roledescription="site banner">
        <div className="banner__tekst">
            <Sidetittel>
                <span aria-label="Permitteringskalkulator">
                    Permitteringskalkulator
                </span>
            </Sidetittel>
        </div>
        <div className="banner__bunnlinje" />
    </div>
);

export default Banner;
