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

    const getSistOppdatert = (sistOppdatert: SistOppdatert | null): string => {
        if (sistOppdatert) {
            const tid = moment(sistOppdatert.publishedAt).format(
                'DD.MM.YYYY, kk:mm:ss'
            );
            return sistOppdatert.title.concat(tid);
        }
        return '';
    };

    return (
        <>
            <Normaltekst
                className={cls.element('sist-oppdatert')}
                id="sist-oppdatert"
            >
                <i>{getSistOppdatert(props.content)}</i>
            </Normaltekst>
        </>
    );
};

export default SistOppdatertInfo;
