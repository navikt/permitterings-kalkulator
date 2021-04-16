import React, { FunctionComponent } from 'react';
import BEMHelper from '../../utils/bem';
import Innholdstittel from 'nav-frontend-typografi/lib/innholdstittel';

interface Props {
    className: string;
    overskrift: string;
    id: string;
}

const Infoseksjon: FunctionComponent<Props> = (props) => {
    const cls = BEMHelper(props.className);

    return (
        <section
            className={cls.element('info-ark')}
            id={props.id}
            role="document"
        >
            <Innholdstittel
                className={cls.element('info-ark-overskrift')}
                role="heading"
                aria-level={1}
            >
                {props.overskrift}
            </Innholdstittel>
            {props.children}
        </section>
    );
};

export default Infoseksjon;
