import React, { FunctionComponent, useEffect, useState } from 'react';
import '../kalkulator.less';
import { Input, Radio, RadioPanelGruppe } from 'nav-frontend-skjema';
import { Normaltekst } from 'nav-frontend-typografi';
import { antalldagerGått, datoErFørMars } from '../utregninger';


interface Props {
    spørsmål: string
    permitteringsid: number
}

const RadioKnappMedMenInputpopUp:FunctionComponent<Props> = props => {
    const [svar, setSvar] = useState('');

    const radios = [
        {
            label: 'Ja',
            value: 'Ja',
            id: props.spørsmål+'-Ja-'+props.permitteringsid,
        },
        {
            label: 'Nei',
            value: 'Nei',
            id: props.spørsmål+'-Nei-'+props.permitteringsid,
        },
    ];

    useEffect(() => {

    }, []);


    return (
        <div className={'permitteringsperiode__radioknapper-med-pop-up'}>
            <Normaltekst>{props.spørsmål}</Normaltekst>
            <div >
                <RadioPanelGruppe
                    className={'permitteringsperiode__radioknapper'}
                    name="samplename"
                    legend=""
                    radios={radios}
                    checked={svar}
                    onChange={(event, value) => {
                        setSvar(value)
                    }}
                />
            </div>
            <>
            { svar === 'Ja' && <Input label={'skriv inn antall dager'}></Input>}
            </>
        </div>
    );
};

export default RadioKnappMedMenInputpopUp;