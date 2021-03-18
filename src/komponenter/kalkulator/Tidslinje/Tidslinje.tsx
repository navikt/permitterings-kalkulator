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
    InformasjonOmAGP2Status,
} from '../beregningerForAGP2';
import Utregningstekst from './Utregningstekst/Utregningstekst';

interface Props {
    allePermitteringerOgFraværesPerioder: AllePermitteringerOgFraværesPerioder;
    set18mndsPeriode: (dato: Dayjs) => void;
    sisteDagIPeriode: Dayjs;
    breddeAvDatoObjektIProsent: number;
    endringAv: 'datovelger' | 'tidslinje' | 'ingen';
    setEndringAv: (endringAv: 'datovelger' | 'tidslinje') => void;
}

const Tidslinje: FunctionComponent<Props> = (props) => {
    const [datoOnDrag, setDatoOnDrag] = useState<Dayjs | undefined>(undefined);
    const { dagensDato, innføringsdatoAGP2 } = useContext(PermitteringContext);
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
    const [
        informasjonOmAGP2Status,
        setInformasjonOmAGP2Status,
    ] = useState<InformasjonOmAGP2Status>({
        brukteDager: 0,
        sluttDato: innføringsdatoAGP2,
        type: ArbeidsgiverPeriode2Resulatet.IKKE_LØPENDE_IKKE_NÅDD_AGP2,
        gjenståendePermitteringsDager: 210,
        fraværsdager: 0,
    });

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
        setInformasjonOmAGP2Status(
            finnInformasjonAGP2(
                tidslinjeObjekter,
                innføringsdatoAGP2,
                finnesLøpende !== undefined,
                dagensDato,
                210
            )
        );
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

    const get18mndsperiode = () => (
        <div
            style={{
                position: posisjonsStylingDragElement,
                left: absoluttPosisjonFraVenstreDragElement.toString() + '%',
                width:
                    (props.breddeAvDatoObjektIProsent * 550).toString() + '%',
            }}
            id={'draggable-periode'}
            className={'kalkulator__draggable-periode'}
        >
            <div className={'kalkulator__draggable-kant venstre'} />
            <div className={'kalkulator__draggable-kant høyre'} />
            <Normaltekst className={'venstre-dato '}>
                {formaterDato(finnDato18MndTilbake(datoVisesPaDragElement))}
            </Normaltekst>

            <Normaltekst className={'høyre-dato'}>
                {formaterDato(datoVisesPaDragElement)}
            </Normaltekst>
        </div>
    );

    const erInteraktiv = process.env.NODE_ENV === 'development';

    return (
        <>
            <div
                role="img"
                aria-label="Visualisering av en tidslinje som inneholder permitterings- og fraværsperiodene, og den aktuelle 18-månedersperioden"
            >
                <div
                    aria-hidden
                    className={'kalkulator__tidslinje-container start'}
                    id={'kalkulator-tidslinje-container'}
                >
                    {tidslinjeObjekter.length > 0 && (
                        <>
                            {erInteraktiv ? (
                                <Draggable
                                    axis={'x'}
                                    bounds={'parent'}
                                    onStop={() => OnTidslinjeDragRelease()}
                                    onDrag={() => OnTidslinjeDrag()}
                                >
                                    {get18mndsperiode()}
                                </Draggable>
                            ) : (
                                get18mndsperiode()
                            )}
                            <div
                                className={'kalkulator__tidslinje-underlag'}
                                id={'kalkulator__tidslinje'}
                            >
                                <div
                                    className={
                                        'kalkulator__tidslinje-fargeperioder'
                                    }
                                >
                                    {htmlFargeObjekt}
                                </div>
                                {htmlElementerForHverDato}
                            </div>
                        </>
                    )}
                </div>
                <Fargeforklaringer />
            </div>
            <div className={'kalkulator__tidslinje-forklaring'}>
                <Utregningstekst
                    tidslinje={tidslinjeObjekter}
                    informasjonOmAGP2Status={informasjonOmAGP2Status}
                />
            </div>
        </>
    );
};

export default Tidslinje;
