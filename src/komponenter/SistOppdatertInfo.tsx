import React from 'react';
import { Normaltekst } from 'nav-frontend-typografi';
import BEMHelper from '../utils/bem';
import { SistOppdatert } from '../sanity-blocks/sanityTypes';
import moment from 'moment';

interface Props {
    className: string;
    content: SistOppdatert | null;
}

const SistOppdatertInfo = (props: Props) => {
    const cls = BEMHelper(props.className);
    const tid = props.content
        ? moment(props.content.publishedAt).format('DD.MM.YYYY, kk:mm:ss')
        : '';
    return (
        <>
            <Normaltekst className={cls.element('sist-oppdatert')}>
                <i>Denne siden blir løpende oppdatert, sist oppdatert {tid}</i>
            </Normaltekst>
        </>
    );
};

export default SistOppdatertInfo;
