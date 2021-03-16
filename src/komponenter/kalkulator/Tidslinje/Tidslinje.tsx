import React, {
    FunctionComponent,
    useContext,
    useEffect,
    useState,
} from 'react';
import {
    finnDato18MndTilbake,
    konstruerStatiskTidslinje,
} from '../utregninger';
import './Tidslinje.less';
import {
    AllePermitteringerOgFraværesPerioder,
    DatoMedKategori,
} from '../typer';
import { Normaltekst } from 'nav-frontend-typografi';
import Draggable from 'react-draggable';

import { Fargeforklaringer } from './Fargeforklaringer';
import {
    lagHTMLObjektForAlleDatoer,
    lagHTMLObjektForPeriodeMedFarge,
    lagObjektForRepresentasjonAvPerioderMedFarge,
    regnUtHorisontalAvstandMellomToElement,
    regnUtPosisjonFraVenstreGittSluttdato,
} from './tidslinjefunksjoner';
import { PermitteringContext } from '../../ContextProvider';
import { Dayjs } from 'dayjs';
import { formaterDato } from '../../Datovelger/datofunksjoner';
import {
    ArbeidsgiverPeriode2Resulatet,
    finnInformasjonAGP2,
    InformasjonOmGjenståendeDagerOgPeriodeAGP2,
} from '../beregningerForAGP2';
import dayjs from 'dayjs';

interface Props {
    allePermitteringerOgFraværesPerioder: AllePermitteringerOgFraværesPerioder;
    set18mndsPeriode: (dato: Dayjs) => void;
    sisteDagIPeriode: Dayjs;
    breddeAvDatoObjektIProsent: number;
    endringAv: 'datovelger' | 'tidslinje' | 'ingen';
    setEndringAv: (endringAv: 'datovelger' | 'tidslinje') => void;
}

const skrivTekst = (
    info: InformasjonOmGjenståendeDagerOgPeriodeAGP2
): string => {
    switch (true) {
        case info.sluttDato?.isSameOrBefore(dayjs('2021-06-02')):
            return 'ikke tilstrekkelig data';
        case info.type === ArbeidsgiverPeriode2Resulatet.NÅDD_AGP2:
            return (
                'treffer AGP2 1.juni, brukt: ' +
                info.brukteDager +
                ' permittert'
            );
        case info.type === ArbeidsgiverPeriode2Resulatet.LØPENDE_IKKE_NÅDD_AGP2:
            return (
                'dersom du har løpende permittering fram til ' +
                formaterDato(info.sluttDato!) +
                ' faller AGP2 på denne datoen. Nå har du per 1. juni brukt ' +
                info.brukteDager +
                'dager'
            );

        case info.type ===
            ArbeidsgiverPeriode2Resulatet.IKKE_LØPENDE_IKKE_NÅDD_AGP2:
            return (
                'I perioden ' +
                formaterDato(finnDato18MndTilbake(info.sluttDato!)) +
                ' - ' +
                formaterDato(info.sluttDato!) +
                ' er det permittert: ' +
                info.brukteDager +
                ' dager. Du kan permittere i ' +
                info.gjenståendePermitteringsDager +
                ' dager fra i dag til ' +
                formaterDato(info.sluttDato!)
            );
    }
    return '';
};

const Tidslinje: FunctionComponent<Props> = (props) => {
    const [datoOnDrag, setDatoOnDrag] = useState<Dayjs | undefined>(undefined);
    const { dagensDato, innføringsdatoAGP2 } = useContext(PermitteringContext);
    const [datoAGP3, setDatoAGP3] = useState<Dayjs | undefined>(undefined);
    const [tidslinjeObjekter, setTidslinjeObjekter] = useState<
        DatoMedKategori[]
    >([]);
    const [
        absoluttPosisjonFraVenstreDragElement,
        setAbsoluttPosisjonFraVenstreDragElement,
    ] = useState(
        regnUtPosisjonFraVenstreGittSluttdato(
            tidslinjeObjekter,
            props.breddeAvDatoObjektIProsent,
            props.sisteDagIPeriode
        )
    );
    const [tekst, setTekst] = useState('');

    const [
        posisjonsStylingDragElement,
        setPosisjonsStylingDragElement,
    ] = useState<
        | '-moz-initial'
        | 'inherit'
        | 'initial'
        | 'revert'
        | 'unset'
        | '-webkit-sticky'
        | 'absolute'
        | 'fixed'
        | 'relative'
        | 'static'
        | 'sticky'
        | undefined
    >('absolute');

    useEffect(() => {
        setTidslinjeObjekter(
            konstruerStatiskTidslinje(
                props.allePermitteringerOgFraværesPerioder,
                dagensDato
            )
        );
    }, [props.allePermitteringerOgFraværesPerioder]);

    useEffect(() => {
        if (props.endringAv === 'datovelger') {
            setPosisjonsStylingDragElement('absolute');
        }
    }, [props.endringAv]);

    useEffect(() => {
        const finnesLøpende = props.allePermitteringerOgFraværesPerioder.permitteringer.find(
            (permittering) => permittering.erLøpende
        );
        // her hender det at løpende-funksjonen kalles
        const infoAGP2 = finnInformasjonAGP2(
            tidslinjeObjekter,
            innføringsdatoAGP2,
            finnesLøpende !== undefined,
            dagensDato,
            210
        );
        tidslinjeObjekter.length && setDatoAGP3(infoAGP2.sluttDato);
        setTekst(skrivTekst(infoAGP2));
    }, [tidslinjeObjekter, props.allePermitteringerOgFraværesPerioder]);

    useEffect(() => {
        const nyPosisjonFraVenstre = regnUtPosisjonFraVenstreGittSluttdato(
            tidslinjeObjekter,
            props.breddeAvDatoObjektIProsent,
            props.sisteDagIPeriode
        );
        if (datoOnDrag && !datoOnDrag.isSame(props.sisteDagIPeriode, 'day')) {
            const posisjonDragElement = regnUtPosisjonFraVenstreGittSluttdato(
                tidslinjeObjekter,
                props.breddeAvDatoObjektIProsent,
                datoOnDrag
            );
            setAbsoluttPosisjonFraVenstreDragElement(
                nyPosisjonFraVenstre - posisjonDragElement
            );
        } else {
            setAbsoluttPosisjonFraVenstreDragElement(nyPosisjonFraVenstre);
        }
    }, [
        datoOnDrag,
        props.sisteDagIPeriode,
        props.breddeAvDatoObjektIProsent,
        tidslinjeObjekter,
    ]);

    const htmlElementerForHverDato = lagHTMLObjektForAlleDatoer(
        tidslinjeObjekter,
        props.breddeAvDatoObjektIProsent,
        dagensDato
    );
    const htmlFargeObjekt = lagHTMLObjektForPeriodeMedFarge(
        lagObjektForRepresentasjonAvPerioderMedFarge(tidslinjeObjekter),
        props.breddeAvDatoObjektIProsent
    );

    const OnTidslinjeDragRelease = () => {
        if (datoOnDrag) {
            props.set18mndsPeriode(datoOnDrag);
        }
    };

    const OnTidslinjeDrag = () => {
        props.setEndringAv('tidslinje');
        setPosisjonsStylingDragElement('static');
        let indeksStartDato = 0;
        let minimumAvstand = 1000;
        htmlElementerForHverDato.forEach((objekt, indeks) => {
            const avstand = regnUtHorisontalAvstandMellomToElement(
                'draggable-periode',
                'kalkulator-tidslinjeobjekt-' + indeks
            );
            if (avstand < minimumAvstand) {
                minimumAvstand = avstand;
                indeksStartDato = indeks;
            }
        });
        setDatoOnDrag(tidslinjeObjekter[indeksStartDato].dato);
    };

    const datoVisesPaDragElement =
        props.endringAv === 'tidslinje' && datoOnDrag
            ? datoOnDrag
            : props.sisteDagIPeriode;

    return (
        <div
            className={'kalkulator__tidslinje-container start'}
            id={'kalkulator-tidslinje-container'}
        >
            {tidslinjeObjekter.length > 0 && (
                <>
                    <Draggable
                        axis={'x'}
                        bounds={'parent'}
                        onStop={() => OnTidslinjeDragRelease()}
                        onDrag={() => OnTidslinjeDrag()}
                    >
                        <div
                            style={{
                                position: posisjonsStylingDragElement,
                                left:
                                    absoluttPosisjonFraVenstreDragElement.toString() +
                                    '%',
                                width:
                                    (
                                        props.breddeAvDatoObjektIProsent * 550
                                    ).toString() + '%',
                            }}
                            id={'draggable-periode'}
                            className={'kalkulator__draggable-periode'}
                        >
                            <div
                                className={'kalkulator__draggable-kant venstre'}
                            />
                            <div
                                className={'kalkulator__draggable-kant høyre'}
                            />
                            <Normaltekst className={'venstre-dato '}>
                                {formaterDato(
                                    finnDato18MndTilbake(datoVisesPaDragElement)
                                )}
                            </Normaltekst>

                            <Normaltekst className={'høyre-dato'}>
                                {formaterDato(datoVisesPaDragElement)}
                            </Normaltekst>
                        </div>
                    </Draggable>
                    <div
                        className={'kalkulator__tidslinje-underlag'}
                        id={'kalkulator__tidslinje'}
                    >
                        <div className={'kalkulator__tidslinje-fargeperioder'}>
                            {htmlFargeObjekt}
                        </div>
                        {htmlElementerForHverDato}
                    </div>
                    <Fargeforklaringer />
                    <Normaltekst
                        className={'kalkulator__tidslinje-agp2-forklaring'}
                    >
                        {tekst}
                    </Normaltekst>
                </>
            )}
        </div>
    );
};

export default Tidslinje;
