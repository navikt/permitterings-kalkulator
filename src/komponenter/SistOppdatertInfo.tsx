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
                    06.04.2020 15:27
                </i>
            </Normaltekst>
            <Normaltekst>
                <i>
                    Vi jobber nå med å oppdatere våre systemer og informasjonen
                    på nav.no
                </i>
            </Normaltekst>
        </>
    );
};

export default SistOppdatertInfo;
