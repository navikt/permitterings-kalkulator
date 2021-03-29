import React, {
    FunctionComponent,
    useContext,
    useEffect,
    useState,
} from 'react';
import { antallDagerGått, finnDato18MndTilbake } from '../utregninger';
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
    Permitteringssituasjon,
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
    tidslinje: DatoMedKategori[];
}

const Tidslinje: FunctionComponent<Props> = (props) => {
    const [datoOnDrag, setDatoOnDrag] = useState<Dayjs | undefined>(undefined);
    const { dagensDato, innføringsdatoAGP2 } = useContext(PermitteringContext);
    const [
        absoluttPosisjonFraVenstreDragElement,
        setAbsoluttPosisjonFraVenstreDragElement,
    ] = useState(
        regnUtPosisjonFraVenstreGittSluttdato(
            props.tidslinje,
            props.breddeAvDatoObjektIProsent,
            props.sisteDagIPeriode
        )
    );
    const [
        informasjonOmAGP2Status,
        setInformasjonOmAGP2Status,
    ] = useState<InformasjonOmAGP2Status>({
        brukteDagerVedInnføringsdato: 0,
        sluttDato: innføringsdatoAGP2,
        type: Permitteringssituasjon.AGP2_IKKE_NÅDD,
        gjenståendePermitteringsDager: 210,
        fraværsdagerVedInnføringsdato: 0,
        permitteringsdagerVedInnføringsdato: 0,
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
        if (props.endringAv === 'datovelger') {
            setPosisjonsStylingDragElement('absolute');
        }
    }, [props.endringAv]);

    useEffect(() => {
        const finnesLøpende = props.allePermitteringerOgFraværesPerioder.permitteringer.find(
            (permittering) => permittering.erLøpende
        );
        const finnesLøpendePermittering = !!props.allePermitteringerOgFraværesPerioder.permitteringer.find(
            (permitteringsperiode) => permitteringsperiode.erLøpende
        );
        if (props.tidslinje.length > 0) {
            props.setEndringAv('datovelger');
            setInformasjonOmAGP2Status(
                finnInformasjonAGP2(
                    props.tidslinje,
                    innføringsdatoAGP2,
                    finnesLøpende !== undefined,
                    dagensDato,
                    210,
                    finnesLøpendePermittering
                )
            );
        }
    }, [props.tidslinje, props.allePermitteringerOgFraværesPerioder]);

    useEffect(() => {
        const sluttDatoIllustrasjonPåTidslinje = informasjonOmAGP2Status.sluttDato
            ? informasjonOmAGP2Status.sluttDato
            : innføringsdatoAGP2;
        props.set18mndsPeriode(sluttDatoIllustrasjonPåTidslinje);
    }, [informasjonOmAGP2Status, props.allePermitteringerOgFraværesPerioder]);

    useEffect(() => {
        const nyPosisjonFraVenstre = regnUtPosisjonFraVenstreGittSluttdato(
            props.tidslinje,
            props.breddeAvDatoObjektIProsent,
            props.sisteDagIPeriode
        );
        if (datoOnDrag && !datoOnDrag.isSame(props.sisteDagIPeriode, 'day')) {
            const posisjonDragElement = regnUtPosisjonFraVenstreGittSluttdato(
                props.tidslinje,
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
        props.tidslinje,
    ]);

    const htmlElementerForHverDato = lagHTMLObjektForAlleDatoer(
        props.tidslinje,
        props.breddeAvDatoObjektIProsent,
        dagensDato
    );
    const htmlFargeObjekt = lagHTMLObjektForPeriodeMedFarge(
        lagObjektForRepresentasjonAvPerioderMedFarge(props.tidslinje),
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
        setDatoOnDrag(props.tidslinje[indeksStartDato].dato);
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
                    (
                        props.breddeAvDatoObjektIProsent *
                        antallDagerGått(
                            finnDato18MndTilbake(datoVisesPaDragElement),
                            datoVisesPaDragElement
                        )
                    ).toString() + '%',
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
            <div className={'kalkulator__tidslinje-forklaring'}>
                <Utregningstekst
                    tidslinje={props.tidslinje}
                    informasjonOmAGP2Status={informasjonOmAGP2Status}
                />
            </div>
            <div
                role="img"
                aria-label="Visualisering av en tidslinje som inneholder permitterings- og fraværsperiodene, og den aktuelle 18-månedersperioden"
            >
                <div
                    aria-hidden
                    className={'kalkulator__tidslinje-container start'}
                    id={'kalkulator-tidslinje-container'}
                >
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
                        <div className={'kalkulator__tidslinje-fargeperioder'}>
                            {htmlFargeObjekt}
                        </div>
                        {htmlElementerForHverDato}
                    </div>
                </div>
                <Fargeforklaringer />
            </div>
        </>
    );
};

export default Tidslinje;
