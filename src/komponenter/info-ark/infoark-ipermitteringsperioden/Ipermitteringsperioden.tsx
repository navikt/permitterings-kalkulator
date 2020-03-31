import React from 'react';
import BEMHelper from '../../../utils/bem';
import Tekstseksjon from '../../infoseksjon/Tekstseksjon';
import KanAnsattejobbe from './tekster/KanAnsattejobbe';
import AvbrytePermitteringen from './tekster/AvbrytePermitteringen';
import OppsigelseUnderPermittering from './tekster/OppsigelseUnderPermittering';

interface Props {
    className: string;
}

const Ipermitteringsperioden = (props: Props) => {
    const cls = BEMHelper(props.className);
    return (
        <div className={cls.element('avsnitt')}>
            <Tekstseksjon tittel="Kan ansatte jobbe når de er permittert?">
                <KanAnsattejobbe />
            </Tekstseksjon>
            <Tekstseksjon tittel="Avbryte permitteringen">
                <AvbrytePermitteringen />
            </Tekstseksjon>
            <OppsigelseUnderPermittering />
        </div>
    );
};

export default Ipermitteringsperioden;
