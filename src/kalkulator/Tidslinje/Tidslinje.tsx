import React, {
    FunctionComponent,
    useContext,
    useEffect,
    useState,
} from 'react';
import './Tidslinje.less';
import {
    AllePermitteringerOgFraværesPerioder,
    DatointervallKategori,
    DatoMedKategori,
} from '../typer';
import { Element, Normaltekst } from 'nav-frontend-typografi';
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
import dayjs, { Dayjs } from 'dayjs';
import {
    antallDagerGått,
    finnDato18MndFram,
    finnDato18MndTilbake,
    formaterDato,
    formaterDatoIntervall,
} from '../utils/dato-utils';
import Tekstforklaring from './Årsmarkør/Tekstforklaring/Tekstforklaring';
import { Permitteringssregelverk } from '../SeResultat/SeResultat';
import {
    finn18mndsperiodeForMaksimeringAvPermitteringsdager,
    finnDatoForMaksPermitteringVedAktivPermitteringFør1Juli,
} from '../utils/beregningerForSluttPåDagpengeforlengelse';
import { konstruerTidslinjeSomSletterPermitteringFørDato } from '../utils/tidslinje-utils';
import { finnDatoForMaksPermitteringNormaltRegelverk } from '../utils/beregningForMaksPermitteringsdagerNormaltRegelverk';

//propertiene set18mndsPeriode og sisteDagIPeriode brukes kun her og ikke i parentkomponenten "Se resultat"
//den sendes allikevel med som property siden Tidslinje rendres avhengig av parentkomponenten med propertien "breddeAvDatoObjekIProsent" bare ut riktig dersom

interface Props {
    set18mndsPeriode: (dato: Dayjs) => void;
    sisteDagIPeriode: Dayjs;
    breddeAvDatoObjektIProsent: number;
    tidslinje: DatoMedKategori[];
    gjeldendeRegelverk: Permitteringssregelverk;
}

const Tidslinje: FunctionComponent<Props> = (props) => {
    const [tidslinjeSomSkalVises, setTidslinjeSomSkalVises] = useState<
        DatoMedKategori[]
    >(props.tidslinje);
    const {
        dagensDato,
        regelEndringsDato1April,
        regelEndring1Juli,
    } = useContext(PermitteringContext);
    const [datoOnDrag, setDatoOnDrag] = useState(dagensDato);
    const [animasjonSkalVises, setAnimasjonSkalVises] = useState(true);

    const [htmlElementerForHverDato, setHtmlElementerForHverDato] = useState<
        any[]
    >([]);
    const [htmlFargeObjekt, setHtmlFargeobjekt] = useState<any[]>([]);

    const datoMaksPermitteringNås =
        props.gjeldendeRegelverk === Permitteringssregelverk.NORMALT_REGELVERK
            ? finnDatoForMaksPermitteringNormaltRegelverk(
                  tidslinjeSomSkalVises,
                  regelEndringsDato1April,
                  26 * 7
              )
            : finnDatoForMaksPermitteringVedAktivPermitteringFør1Juli(
                  tidslinjeSomSkalVises,
                  regelEndringsDato1April,
                  49 * 7,
                  dagensDato
              );

    //dette må til for at tidslinja rendres rett. Dette har med utregningene av størelsene å gjøre, som må gjøres i parentkomponenten
    //verdien er gitt i breddeAvDatoObjektIProsent
    useEffect(() => {
        if (datoMaksPermitteringNås) {
            const nyDatoTrigger = dayjs(datoMaksPermitteringNås);
            props.set18mndsPeriode(nyDatoTrigger);
        } else {
            const intervallDerMaksKanNås = finn18mndsperiodeForMaksimeringAvPermitteringsdager(
                tidslinjeSomSkalVises,
                regelEndringsDato1April,
                dagensDato,
                26 * 7
            );
            props.set18mndsPeriode(intervallDerMaksKanNås!!.datoTil);
        }
    }, [tidslinjeSomSkalVises, props.gjeldendeRegelverk]);

    useEffect(() => {
        const nyTidslinje: DatoMedKategori[] = konstruerTidslinjeSomSletterPermitteringFørDato(
            props.tidslinje,
            regelEndring1Juli,
            props.gjeldendeRegelverk
        );
        setTidslinjeSomSkalVises(nyTidslinje);
    }, [props.tidslinje, props.gjeldendeRegelverk]);

    useEffect(() => {
        const element = lagHTMLObjektForAlleDatoer(
            tidslinjeSomSkalVises,
            props.breddeAvDatoObjektIProsent,
            dagensDato,
            datoMaksPermitteringNås
        );
        setHtmlElementerForHverDato(element);
        const htmlFargeObjekt = lagHTMLObjektForPeriodeMedFarge(
            lagObjektForRepresentasjonAvPerioderMedFarge(tidslinjeSomSkalVises),
            props.breddeAvDatoObjektIProsent
        );
        setHtmlFargeobjekt(htmlFargeObjekt);
    }, [tidslinjeSomSkalVises, props.sisteDagIPeriode]);

    const OnTidslinjeDrag = () => {
        setAnimasjonSkalVises(false);
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
        setDatoOnDrag(tidslinjeSomSkalVises[indeksStartDato].dato);
    };

    const skalVæreAnimasjonPåTidslinje = animasjonSkalVises
        ? 'animasjon'
        : 'ingen-animasjon';

    const get18mndsperiode = () => (
        <div
            style={{
                width:
                    (
                        props.breddeAvDatoObjektIProsent *
                        (antallDagerGått(
                            finnDato18MndTilbake(datoOnDrag),
                            datoOnDrag
                        ) -
                            1)
                    ).toString() + '%',
            }}
            id={'draggable-periode'}
            className={
                'kalkulator__draggable-periode ' + skalVæreAnimasjonPåTidslinje
            }
        >
            <div className={'kalkulator__draggable-kant venstre'} />
            <div className={'kalkulator__draggable-tekst-container'}>
                <Normaltekst>
                    {formaterDatoIntervall({
                        datoFra: finnDato18MndTilbake(datoOnDrag),
                        datoTil: datoOnDrag,
                    })}
                </Normaltekst>
                <Element className={'kalkulator__draggable-tekst'}>
                    {' '}
                    18 måneder{' '}
                </Element>
            </div>
            <div className={'kalkulator__draggable-kant høyre'} />
        </div>
    );

    const finnesSlettetPermittering =
        props.gjeldendeRegelverk ===
            Permitteringssregelverk.NORMALT_REGELVERK &&
        !!tidslinjeSomSkalVises.find(
            (objekt) =>
                objekt.kategori ===
                DatointervallKategori.SLETTET_PERMITTERING_FØR_1_JULI
        );

    return (
        <div className={'tidslinje'}>
            <Tekstforklaring
                tidslinje={tidslinjeSomSkalVises}
                datoVisesPaDragElement={datoOnDrag}
            />

            <div
                role="img"
                aria-label="Visualisering av en tidslinje som inneholder permitterings- og fraværsperiodene, og den aktuelle 18-månedersperioden"
            >
                <div
                    aria-hidden
                    className={'kalkulator__tidslinje-container start'}
                    id={'kalkulator-tidslinje-container'}
                >
                    <Draggable
                        axis={'x'}
                        bounds={'parent'}
                        onDrag={() => OnTidslinjeDrag()}
                    >
                        {get18mndsperiode()}
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
                </div>
                {Fargeforklaringer(finnesSlettetPermittering)}
            </div>
        </div>
    );
};

export default Tidslinje;
