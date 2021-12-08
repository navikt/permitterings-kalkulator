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
import { Dayjs } from 'dayjs';
import { Hovedknapp } from 'nav-frontend-knapper';
import { ReactComponent as PekIkon } from './cursor-touch-2.svg';
import Tidslinje from '../Tidslinje/Tidslinje';
import Utregningstekst from './Utregningstekst/Utregningstekst';
import { Undertittel } from 'nav-frontend-typografi';
import { fraPixelTilProsent } from '../Tidslinje/tidslinjefunksjoner';
import './SeResultat.less';
import { formaterDato, perioderOverlapper } from '../utils/dato-utils';
import { loggKnappTrykketPå } from '../../utils/amplitudeEvents';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { arbeidsgiverPotensieltStartetLønnspliktFør1Juli } from './Utregningstekst/spesialCaseForLønnspliktStartetFør1Juli';
import ContextProvider, { PermitteringContext } from '../../ContextProvider';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import { Checkbox, RadioPanelGruppe } from 'nav-frontend-skjema';

interface Props {
    allePermitteringerOgFraværesPerioder: AllePermitteringerOgFraværesPerioder;
    set18mndsPeriode: (dato: Dayjs) => void;
    sisteDagIPeriode: Dayjs;
    endringAv: 'datovelger' | 'tidslinje' | 'ingen';
    setEndringAv: (endringAv: 'datovelger' | 'tidslinje') => void;
    tidslinje: DatoMedKategori[];
}

export const SeResultat: FunctionComponent<Props> = (props) => {
    const [resultatVises, setResultatVises] = useState(false);
    const { regelEndring1Juli, regelEndringsDato1Januar } = useContext(
        PermitteringContext
    );
    const [
        visBeskjedLønnspliktPeriode,
        setVisBeskjedLønnspliktPeriode,
    ] = useState(false);

    useEffect(() => {
        setResultatVises(false);
        if (
            props.tidslinje.length > 0 &&
            !perioderOverlapper(
                props.allePermitteringerOgFraværesPerioder.permitteringer
            )
        ) {
            props.setEndringAv('datovelger');
        }
    }, [props.tidslinje, props.allePermitteringerOgFraværesPerioder]);

    const skalViseTidslinje =
        (window.location.href.includes('labs') ||
            process.env.NODE_ENV === 'development') &&
        props.tidslinje.length;

    useEffect(() => {
        console.log('useeffect');
        if (
            props.allePermitteringerOgFraværesPerioder.permitteringer.length >
                0 &&
            props.tidslinje.length > 0
        ) {
            console.log('in if');
            const harLønnspliktISpesialtilfelle = arbeidsgiverPotensieltStartetLønnspliktFør1Juli(
                props.tidslinje,
                regelEndringsDato1Januar
            );
            setVisBeskjedLønnspliktPeriode(!!harLønnspliktISpesialtilfelle);
        }
    }, [
        props.tidslinje,
        regelEndring1Juli,
        props.allePermitteringerOgFraværesPerioder,
    ]);

    return (
        <>
            <Undertittel className="se-resultat__tittel">
                3. Se resultatet av beregningen
            </Undertittel>
            <div className="se-resultat__innhold">
                <Hovedknapp
                    className="se-resultat__knapp"
                    onClick={() => {
                        if (visBeskjedLønnspliktPeriode) {
                            return;
                        }
                        setResultatVises(true);
                        loggKnappTrykketPå('Se beregningen');
                    }}
                >
                    <PekIkon className="se-resultat__knapp-ikon" />
                    Se beregningen
                </Hovedknapp>
                {visBeskjedLønnspliktPeriode && (
                    <AlertStripeInfo>
                        Permitteringen som løpte uten lønnsplikt fra{' '}
                        <Checkbox
                            label={'Begynte lønnspliktperioden før 1. juli?'}
                            checked={true}
                        />
                    </AlertStripeInfo>
                )}
                {resultatVises && (
                    <>
                        <Utregningstekst
                            tidslinje={props.tidslinje}
                            allePermitteringerOgFraværesPerioder={
                                props.allePermitteringerOgFraværesPerioder
                            }
                        />
                        <div
                            className={'se-resultat__tidslinje-wrapper'}
                            id="tidslinje-wrapper"
                        >
                            {skalViseTidslinje && (
                                <Ekspanderbartpanel tittel={'Vis illustrasjon'}>
                                    <Tidslinje
                                        allePermitteringerOgFraværesPerioder={
                                            props.allePermitteringerOgFraværesPerioder
                                        }
                                        set18mndsPeriode={
                                            props.set18mndsPeriode
                                        }
                                        sisteDagIPeriode={
                                            props.sisteDagIPeriode
                                        }
                                        breddeAvDatoObjektIProsent={fraPixelTilProsent(
                                            'tidslinje-wrapper',
                                            props.tidslinje.length
                                        )}
                                        endringAv={props.endringAv}
                                        setEndringAv={props.setEndringAv}
                                        tidslinje={props.tidslinje}
                                    />
                                </Ekspanderbartpanel>
                            )}
                        </div>
                    </>
                )}
            </div>
        </>
    );
};
