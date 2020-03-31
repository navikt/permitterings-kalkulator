import React, { FunctionComponent } from 'react';
import BEMHelper from '../../utils/bem';
import Innholdstittel from 'nav-frontend-typografi/lib/innholdstittel';

interface Props {
    className: string;
    overskrift: string;
}

const Infoseksjon: FunctionComponent<Props> = (props) => {
    const cls = BEMHelper(props.className);

    return (
        <section className={cls.element('info-ark')}>
            <Innholdstittel className={cls.element('info-ark-overskrift')}>{props.overskrift}</Innholdstittel>
            {props.children}
        </section>
    );
};

export default Infoseksjon;
