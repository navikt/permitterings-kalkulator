import React from 'react';
import { Normaltekst } from 'nav-frontend-typografi';
import BEMHelper from '../utils/bem';

interface Props {
    className: string;
}

const SistOppdatertInfo = (props: Props) => {
    const cls = BEMHelper(props.className);
    return (
        <>
            <Normaltekst className={cls.element('sist-oppdatert')}>
                <i>
                    Denne siden blir løpende oppdatert, sist oppdatert
                    23.04.2020 12:00
                </i>
            </Normaltekst>
        </>
    );
};

export default SistOppdatertInfo;
