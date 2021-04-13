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
import { filtrerBortUdefinerteDatoIntervaller } from '../../utils/dato-utils';
import { finnDenAktuelle18mndsperiodenSomSkalBeskrives } from '../../utils/beregningerForAGP2';
import AlertStripe from 'nav-frontend-alertstriper';

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

    const aktuell18mndsperiode = finnDenAktuelle18mndsperiodenSomSkalBeskrives(
        props.tidslinje,
        dagensDato,
        innføringsdatoAGP2,
        210
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
            {aktuell18mndsperiode && (
                <DetaljertUtregning
                    tidslinje={props.tidslinje}
                    permitteringsperioder={filtrerBortUdefinerteDatoIntervaller(
                        props.allePermitteringerOgFraværesPerioder
                            .permitteringer
                    )}
                    aktuell18mndsperiode={aktuell18mndsperiode}
                />
            )}
            <AlertStripe
                type={'info'}
                form={'inline'}
                className="utregningstekst__alertstripe"
            >
                <Element>
                    NB! Lørdager og søndager forskyver arbeidsgiverperiode 2
                </Element>
                <Normaltekst>
                    Hvis arbeidsgiverperiode 2 inntreffer på en helgedag,
                    betaler du permitteringslønn i fem fortløpende dager fra og
                    med førstkommende mandag.
                </Normaltekst>
            </AlertStripe>
            <Normaltekst className="utregningstekst__informasjonslenker">
                <Lenke href="https://arbeidsgiver.nav.no/arbeidsgiver-permittering/#narSkalJegUtbetale">
                    Les mer om arbeidsgiverperiode 2
                </Lenke>
                <Lenke href="/arbeidsgiver-permittering">
                    Tilbake til permitteringsveiviseren
                </Lenke>
            </Normaltekst>
        </div>
    );
};

export default Utregningstekst;
