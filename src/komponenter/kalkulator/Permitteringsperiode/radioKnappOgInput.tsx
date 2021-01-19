import React, { FunctionComponent, useState } from 'react';
import '../kalkulator.less';
import { Input, RadioPanelGruppe } from 'nav-frontend-skjema';
import { Normaltekst } from 'nav-frontend-typografi';
import { PermitteringsperiodeInfo } from '../kalkulator';


interface Props {
    indeks: number
    setAllePermitteringer: (permitteringer: PermitteringsperiodeInfo[]) => void;
    type: string
    allePermitteringer: PermitteringsperiodeInfo[];
}

const RadioKnappMedMenInputpopUp:FunctionComponent<Props> = props => {
    const [svar, setSvar] = useState('');

    const spørsmål = props.type === 'SYKMELDING'?
        "Har den ansatte vært 100 % sykmeldt i denne perioden?"
        :
        "Har den ansatte hatt fravær i forbindelse med andre permisjoner eller tatt ut ferie i denne perioden?"


    const radios = [
        {
            label: 'Ja',
            value: 'Ja',
            id: props.type+'-Ja-'+props.indeks,
        },
        {
            label: 'Nei',
            value: 'Nei',
            id: props.type+'-Nei-'+props.indeks,
        },
    ];

    const oppdaterInfoOgListe = (value: string) => {
        const kopiAvInfo: PermitteringsperiodeInfo[] = [...props.allePermitteringer]
        if (props.type === 'SYKMELDING') {
            kopiAvInfo[props.indeks].antallDagerSykmeldt = parseInt(value)
            console.log('dette skjer')
        }
        else {
            kopiAvInfo[props.indeks].antallDagerPErmisjonOgFerie = parseInt(value)
        }
        props.setAllePermitteringer(kopiAvInfo);
    }

    return (
        <div className={'permitteringsperiode__radioknapper-med-pop-up'}>
            <Normaltekst>{spørsmål}</Normaltekst>
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
            { svar === 'Ja' &&
            <Input label={'skriv inn antall dager'} onChange={(event) =>
                oppdaterInfoOgListe(event.target.value)
            }>
            </Input>}
            </>
        </div>
    );
};

export default RadioKnappMedMenInputpopUp;