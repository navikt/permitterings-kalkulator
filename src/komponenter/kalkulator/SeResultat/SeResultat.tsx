import React, { FunctionComponent, useEffect, useState } from 'react';
import {
    AllePermitteringerOgFraværesPerioder,
    DatoMedKategori,
} from '../typer';
import { Dayjs } from 'dayjs';
import { Hovedknapp } from 'nav-frontend-knapper';
import pek from './cursor-touch-2.svg';
import Tidslinje from '../Tidslinje/Tidslinje';
import Utregningstekst from './Utregningstekst/Utregningstekst';
import { Undertittel } from 'nav-frontend-typografi';
import { fraPixelTilProsent } from '../Tidslinje/tidslinjefunksjoner';
import './SeResultat.less';

interface Props {
    // Tidlinje-props
    allePermitteringerOgFraværesPerioder: AllePermitteringerOgFraværesPerioder;
    set18mndsPeriode: (dato: Dayjs) => void;
    sisteDagIPeriode: Dayjs;
    endringAv: 'datovelger' | 'tidslinje' | 'ingen';
    setEndringAv: (endringAv: 'datovelger' | 'tidslinje') => void;
    tidslinje: DatoMedKategori[];
}

export const SeResultat: FunctionComponent<Props> = (props) => {
    const [resultatVises, setResultatVises] = useState(false);

    useEffect(() => {
        setResultatVises(false);

        if (props.tidslinje.length > 0) {
            props.setEndringAv('datovelger');
        }
    }, [props.tidslinje, props.allePermitteringerOgFraværesPerioder]);

    return (
        <>
            <Undertittel>3. Beregningen vises i tidslinje</Undertittel>
            <div className="se-resultat__innhold">
                <Hovedknapp
                    className="se-resultat__knapp"
                    onClick={() => setResultatVises(true)}
                >
                    <img alt={'trykk her-symbol'} src={pek} />
                    Se beregningen
                </Hovedknapp>
                {resultatVises && (
                    <>
                        <div className={'kalkulator__tidslinje-forklaring'}>
                            <Utregningstekst
                                tidslinje={props.tidslinje}
                                allePermitteringerOgFraværesPerioder={
                                    props.allePermitteringerOgFraværesPerioder
                                }
                            />
                        </div>
                        <div id={'kalkulator-tidslinje-wrapper'}>
                            {props.tidslinje.length && (
                                <Tidslinje
                                    allePermitteringerOgFraværesPerioder={
                                        props.allePermitteringerOgFraværesPerioder
                                    }
                                    set18mndsPeriode={props.set18mndsPeriode}
                                    sisteDagIPeriode={props.sisteDagIPeriode}
                                    breddeAvDatoObjektIProsent={fraPixelTilProsent(
                                        'kalkulator-tidslinje-wrapper',
                                        props.tidslinje.length
                                    )}
                                    endringAv={props.endringAv}
                                    setEndringAv={props.setEndringAv}
                                    tidslinje={props.tidslinje}
                                />
                            )}
                        </div>
                    </>
                )}
            </div>
        </>
    );
};
