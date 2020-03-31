import React, { FunctionComponent } from 'react';
import BEMHelper from '../utils/bem';

interface Props {
    className: string;
}

const Infoseksjon: FunctionComponent<Props> = (props) => {
    const cls = BEMHelper(props.className);

    return <section className={cls.element('info-ark')}>{props.children}</section>;
};

export default Infoseksjon;
