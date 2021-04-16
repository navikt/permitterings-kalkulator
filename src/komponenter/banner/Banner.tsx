import React, { FunctionComponent, ReactElement } from 'react';
import BEMHelper from '../../utils/bem';
import { Sidetittel } from 'nav-frontend-typografi';
import './banner.less';

interface Props {
    classname: string;
    center?: boolean;
}

const Banner: FunctionComponent<Props> = (props) => {
    const cls = BEMHelper(props.classname);
    const className = props.center
        ? cls.className.concat(' ').concat(cls.modifier('center'))
        : cls.className;
    return (
        <div
            className={className}
            role="banner"
            aria-roledescription="site banner"
        >
            <div className={cls.element('tekst')}>
                <Sidetittel>{props.children}</Sidetittel>
            </div>
            <div className={cls.element('bunnlinje')} />
        </div>
    );
};

export default Banner;
