import React, {
    FunctionComponent,
    useContext,
    useEffect,
    useState,
} from 'react';
import {
    AllePermitteringerOgFraværesPerioder,
    DatoMedKategori,
} from '../typer';
import dayjs, { Dayjs } from 'dayjs';
import { Hovedknapp } from 'nav-frontend-knapper';
import { ReactComponent as PekIkon } from './cursor-touch-2.svg';
import Tidslinje from '../Tidslinje/Tidslinje';
import Utregningstekst from './Utregningstekst/Utregningstekst';
import { Undertittel, Element } from 'nav-frontend-typografi';
import { fraPixelTilProsent } from '../Tidslinje/tidslinjefunksjoner';
import './SeResultat.less';
import {
    loggAntallPermitteringsperioder,
    loggKnappTrykketPå,
} from '../../utils/amplitudeEvents';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { PermitteringContext } from '../../ContextProvider';
import { finnUtOmKoronaregelverkSkalBrukes } from '../utils/beregningerForSluttPåDagpengeforlengelse';
import lampeikon from './lampeikon.svg';
import { Checkbox, Alert } from '@navikt/ds-react';
import { finnFørsteDatoMedPermitteringUtenFravær } from '../utils/tidslinje-utils';
import {
    dagensDato,
    regelEndring1Juli,
} from '../../konstanterKnyttetTilRegelverk';

interface Props {
    allePermitteringerOgFraværesPerioder: AllePermitteringerOgFraværesPerioder;
    set18mndsPeriode: (dato: Dayjs) => void;
    sisteDagIPeriode: Dayjs;
    tidslinje: DatoMedKategori[];
}

export enum Permitteringssregelverk {
    KORONA_ORDNING = 'KORONA_ORDNING',
    NORMALT_REGELVERK = 'NORMALT_REGELVERK',
}

export const SeResultat: FunctionComponent<Props> = (props) => {
    const [resultatVises, setResultatVises] = useState(false);
    const [gjeldeneRegelverk, setGjeldendeRegelverk] = useState<
        Permitteringssregelverk | undefined
    >(Permitteringssregelverk.NORMALT_REGELVERK);
    const [
        visBeskjedLønnspliktPeriode,
        setVisBeskjedLønnspliktPeriode,
    ] = useState(false);

    //clean-up useEffect for å nullstille parametere når input endres
    useEffect(() => {
        setResultatVises(false);
        setVisBeskjedLønnspliktPeriode(false);
        setGjeldendeRegelverk(Permitteringssregelverk.NORMALT_REGELVERK);
    }, [props.allePermitteringerOgFraværesPerioder]);

    useEffect(() => {
        const skalVærePåKoronaRegelverk = finnUtOmKoronaregelverkSkalBrukes(
            props.tidslinje,
            dagensDato,
            regelEndring1Juli
        );
        if (skalVærePåKoronaRegelverk) {
            setGjeldendeRegelverk(Permitteringssregelverk.KORONA_ORDNING);
        } else {
            setGjeldendeRegelverk(Permitteringssregelverk.NORMALT_REGELVERK);
        }
        //potensiale for at arbeidsgiver hadde lønsplikt før 1. juli og dermed permitterer på koronaordning
        const grenseDatoForPotensiellLønnspliktFør1Juli = dayjs('2021-09-01');
        if (
            finnUtOmKoronaregelverkSkalBrukes(
                props.tidslinje,
                dagensDato,
                grenseDatoForPotensiellLønnspliktFør1Juli
            ) &&
            !visBeskjedLønnspliktPeriode &&
            !skalVærePåKoronaRegelverk
        ) {
            setVisBeskjedLønnspliktPeriode(true);
            setGjeldendeRegelverk(undefined);
        }
    }, [props.tidslinje, props.allePermitteringerOgFraværesPerioder]);

    //tidslinja er deaktivert i prod
    const skalViseTidslinje =
        gjeldeneRegelverk === Permitteringssregelverk.KORONA_ORDNING ||
        finnFørsteDatoMedPermitteringUtenFravær(
            props.tidslinje,
            regelEndring1Juli.subtract(1, 'day')
        );

    const endreRegelverk = (regelverk: Permitteringssregelverk) => {
        if (gjeldeneRegelverk === regelverk) {
            setGjeldendeRegelverk(undefined);
        } else {
            setGjeldendeRegelverk(regelverk);
        }
        setResultatVises(true);
    };

    return (
        <>
            <Undertittel className="se-resultat__tittel">
                3. Se resultatet av beregningen
            </Undertittel>
            <div className="se-resultat__innhold">
                {!!props.allePermitteringerOgFraværesPerioder.permitteringer[0]
                    .datoFra && (
                    <Hovedknapp
                        className="se-resultat__knapp"
                        onClick={() => {
                            setResultatVises(true);
                            loggKnappTrykketPå('Se beregningen');
                            loggAntallPermitteringsperioder(
                                props.allePermitteringerOgFraværesPerioder
                                    .permitteringer.length
                            );
                        }}
                    >
                        <PekIkon className="se-resultat__knapp-ikon" />
                        Se beregningen
                    </Hovedknapp>
                )}

                {resultatVises && (
                    <div className="utregningstekst">
                        <img
                            className="utregningstekst__lampeikon"
                            src={lampeikon}
                            alt=""
                        />
                        {visBeskjedLønnspliktPeriode && (
                            <>
                                <Element>
                                    Begynte lønnspliktperioden før 1. juli for
                                    den aktive permitteringen?
                                </Element>
                                <Alert variant="info" size="small">
                                    Husk at du skal fylle inn
                                    permitteringsperiodene etter lønnsplikt.
                                </Alert>
                                <div
                                    className={
                                        'utregningstekst__checkbokscontainer'
                                    }
                                >
                                    <Checkbox
                                        className={'utregningstekst__checkboks'}
                                        value="Ja"
                                        checked={
                                            gjeldeneRegelverk ===
                                            Permitteringssregelverk.KORONA_ORDNING
                                        }
                                        onChange={() => {
                                            endreRegelverk(
                                                Permitteringssregelverk.KORONA_ORDNING
                                            );
                                        }}
                                    >
                                        Ja
                                    </Checkbox>
                                    <Checkbox
                                        className={'utregningstekst__checkboks'}
                                        value="Nei"
                                        checked={
                                            gjeldeneRegelverk ===
                                            Permitteringssregelverk.NORMALT_REGELVERK
                                        }
                                        onChange={() => {
                                            endreRegelverk(
                                                Permitteringssregelverk.NORMALT_REGELVERK
                                            );
                                        }}
                                    >
                                        Nei
                                    </Checkbox>
                                </div>
                            </>
                        )}
                        {gjeldeneRegelverk && (
                            <Utregningstekst
                                tidslinje={props.tidslinje}
                                allePermitteringerOgFraværesPerioder={
                                    props.allePermitteringerOgFraværesPerioder
                                }
                                gjeldendeRegelverk={
                                    gjeldeneRegelverk
                                        ? gjeldeneRegelverk
                                        : Permitteringssregelverk.NORMALT_REGELVERK
                                }
                            />
                        )}
                        <div
                            className={'se-resultat__tidslinje-wrapper'}
                            id="tidslinje-wrapper"
                        >
                            {skalViseTidslinje && (
                                <Tidslinje
                                    gjeldendeRegelverk={
                                        gjeldeneRegelverk
                                            ? gjeldeneRegelverk
                                            : Permitteringssregelverk.NORMALT_REGELVERK
                                    }
                                    set18mndsPeriode={props.set18mndsPeriode}
                                    sisteDagIPeriode={props.sisteDagIPeriode}
                                    breddeAvDatoObjektIProsent={fraPixelTilProsent(
                                        'tidslinje-wrapper',
                                        props.tidslinje.length
                                    )}
                                    tidslinje={props.tidslinje}
                                />
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};
