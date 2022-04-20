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
import { PermitteringContext } from '../../ContextProvider';
import { finnUtOmKoronaregelverkPtensieltSkalBrukes } from '../utils/beregningerForSluttPåDagpengeforlengelse';
import lampeikon from './lampeikon.svg';
import { Checkbox, Alert } from '@navikt/ds-react';
import {
    finnFørsteDatoMedPermitteringUtenFravær,
    konstruerTidslinje,
} from '../utils/tidslinje-utils';

interface Props {
    allePermitteringerOgFraværesPerioder: AllePermitteringerOgFraværesPerioder;
}

export enum Permitteringssregelverk {
    KORONA_ORDNING = 'KORONA_ORDNING',
    NORMALT_REGELVERK = 'NORMALT_REGELVERK',
}

export const SeResultat: FunctionComponent<Props> = (props) => {
    const [tidslinje, setTidslinje] = useState<DatoMedKategori[]>([]);
    const [resultatVises, setResultatVises] = useState(false);
    const {
        regelEndring1Juli,
        dagensDato,
        regelEndringsDato1April,
    } = useContext(PermitteringContext);
    const [gjeldeneRegelverk, setGjeldendeRegelverk] = useState<
        Permitteringssregelverk | undefined
    >(Permitteringssregelverk.NORMALT_REGELVERK);
    const [
        visBeskjedLønnspliktPeriode,
        setVisBeskjedLønnspliktPeriode,
    ] = useState(false);
    const [sisteDagI18mndsPeriode, setSisteDagI18mndsPeriode] = useState<Dayjs>(
        dagensDato
    );

    //clean-up useEffect for å nullstille parametere når input endres
    useEffect(() => {
        setResultatVises(false);
        setVisBeskjedLønnspliktPeriode(false);
        setGjeldendeRegelverk(Permitteringssregelverk.NORMALT_REGELVERK);
    }, [props.allePermitteringerOgFraværesPerioder]);

    useEffect(() => {
        setTidslinje(
            konstruerTidslinje(
                props.allePermitteringerOgFraværesPerioder,
                dagensDato
            )
        );
    }, [props.allePermitteringerOgFraværesPerioder]);

    // useEffect for å finne hvilket regelverk permitteringen løper på.
    // Dette kan fjernes på et tidspunkt det ikke er mulig/er liten sjanse for at arbeidsgiverne løper på koronaregelverk. Da vil alt være på normalt regelverk, og koden kan forenkles.
    useEffect(() => {
        if (tidslinje.length) {
            //Her regnes det ut om permitteringen løper på koronaregelverket. Det gjør den dersom permitteringen er iverksatt før 1. juli og enten er løpende eller har sluttdato på dagens dato eller senere.
            const skalVærePåKoronaRegelverk = finnUtOmKoronaregelverkPtensieltSkalBrukes(
                tidslinje,
                dagensDato,
                regelEndring1Juli
            );
            if (skalVærePåKoronaRegelverk) {
                setGjeldendeRegelverk(Permitteringssregelverk.KORONA_ORDNING);
            } else {
                setGjeldendeRegelverk(
                    Permitteringssregelverk.NORMALT_REGELVERK
                );
            }
            const grenseDatoForPotensiellLønnspliktFør1Juli = dayjs(
                '2021-09-01'
            );
            //I denne if-setningen sjekker vi om permittering uten lønn begynte før 1. september 2021.
            //Hvis permittering uten lønn begynte før 1. september er det en sannsynlighet for at permitteringen ble iverksatt før 1. juli 2021, slik at den løper på koronaregelverket
            //Dersom if-setningen er sann får arbeidsgiveren spørsmål om lønnsplitperioden begyne før 1. juli 2021 i toppen av resultatboksen når hen trykker på "Vis resultat"
            if (
                finnUtOmKoronaregelverkPtensieltSkalBrukes(
                    tidslinje,
                    dagensDato,
                    grenseDatoForPotensiellLønnspliktFør1Juli
                ) &&
                !visBeskjedLønnspliktPeriode &&
                !skalVærePåKoronaRegelverk
            ) {
                setVisBeskjedLønnspliktPeriode(true);
                setGjeldendeRegelverk(undefined);
            }
        }
    }, [tidslinje]);

    const skalViseTidslinje =
        gjeldeneRegelverk === Permitteringssregelverk.KORONA_ORDNING ||
        finnFørsteDatoMedPermitteringUtenFravær(
            tidslinje,
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

    console.log('rendrer se resultat');

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
                                tidslinje={tidslinje}
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
                                    set18mndsPeriode={setSisteDagI18mndsPeriode}
                                    sisteDagIPeriode={sisteDagI18mndsPeriode}
                                    //breddeAvDatoObjektIProsent er nødvendig for at tidslinjeillustrasjonen har rett og responsiv størrelse
                                    //størrelsen må regnes ut i parentkomponenten for å vite størrelsen før illustrasjonen rendres.
                                    // hvis illustrasjonen rendres før størrelsen er utregnet vil alt ligge over hverandre i illustrasjonen
                                    breddeAvDatoObjektIProsent={fraPixelTilProsent(
                                        'tidslinje-wrapper',
                                        tidslinje.length
                                    )}
                                    tidslinje={tidslinje}
                                />
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};
