import React, { FunctionComponent, useContext } from 'react';
import './Utregningstekst.less';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import {
    AllePermitteringerOgFraværesPerioder,
    DatoMedKategori,
} from '../../typer';
import Lenke from 'nav-frontend-lenker';
import lampeikon from './lampeikon.svg';
import { PermitteringContext } from '../../../ContextProvider';
import { lagResultatTekst } from './utregningstekst-utils';
import { DetaljertUtregning } from '../DetaljertUtregning/DetaljertUtregning';
import {
    filtrerBortUdefinerteDatoIntervaller,
    tilDatoIntervall,
} from '../../utils/dato-utils';

interface Props {
    tidslinje: DatoMedKategori[];
    allePermitteringerOgFraværesPerioder: AllePermitteringerOgFraværesPerioder;
}

const Utregningstekst: FunctionComponent<Props> = (props) => {
    const { dagensDato, innføringsdatoAGP2 } = useContext(PermitteringContext);

    const resultatTekst = lagResultatTekst(
        props.tidslinje,
        props.allePermitteringerOgFraværesPerioder,
        dagensDato,
        innføringsdatoAGP2
    );

    return (
        <div className="utregningstekst">
            <img
                className="utregningstekst__lampeikon"
                src={lampeikon}
                alt=""
            />
            <Element>{resultatTekst.konklusjon}</Element>
            {resultatTekst.beskrivelse}
            <Normaltekst className="utregningstekst__informasjonslenker">
                <Lenke href="https://arbeidsgiver.nav.no/arbeidsgiver-permittering/#narSkalJegUtbetaleLonn">
                    Les mer om Arbeidsgiverperiode 2
                </Lenke>
                <Lenke href="https://arbeidsgiver.nav.no/arbeidsgiver-permittering/">
                    Tilbake til permitteringsveivisereng
                </Lenke>
            </Normaltekst>
            <DetaljertUtregning
                tidslinje={props.tidslinje}
                permitteringsperioder={filtrerBortUdefinerteDatoIntervaller(
                    props.allePermitteringerOgFraværesPerioder.permitteringer
                )}
            />
        </div>
    );
};

export default Utregningstekst;
