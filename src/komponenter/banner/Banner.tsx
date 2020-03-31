import React from 'react';
import BEMHelper from '../../utils/bem';
import { Sidetittel } from 'nav-frontend-typografi';
import './banner.less';

interface Props {
    classname: string;
}

const Banner = (props: Props) => {
    const cls = BEMHelper(props.classname);
    return (
        <>
            <div className={cls.className}>
                <div className={cls.element('tekst')}>
                    <Sidetittel>Permittering som følge av koronavirus</Sidetittel>
                </div>
                <div className={cls.element('bunnlinje')} />
            </div>
        </>
    );
};

export default Banner;
