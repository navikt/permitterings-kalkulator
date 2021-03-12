import React, { FunctionComponent, useContext, useState } from 'react';
import './Topp.less';
import {
    finnDato18MndFram,
    finnDato18MndTilbake,
    finnGrenserFor18MNDPeriode,
} from '../utregninger';
import { Element, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import Datovelger from '../../Datovelger/Datovelger';
import kalender from './kalender.svg';
import Lenke from 'nav-frontend-lenker';
import { PermitteringContext } from '../../ContextProvider';
import dayjs, { Dayjs } from 'dayjs';
import { formaterDato } from '../../Datovelger/datofunksjoner';

interface Props {
    set18mndsPeriode: (dato: Dayjs) => void;
    sisteDagIPeriode: Dayjs;
    endringAv: 'datovelger' | 'tidslinje' | 'ingen';
    setEndringAv: (endringAv: 'datovelger' | 'tidslinje') => void;
}

const Topp: FunctionComponent<Props> = (props) => {
    const [feilMelding, setFeilmelding] = useState('');
    const { dagensDatoDayjs } = useContext(PermitteringContext);

    const datoValidering = (dato: Dayjs) => {
        if (dato.isSame(finnGrenserFor18MNDPeriode(dagensDatoDayjs).datoTil!)) {
            setFeilmelding(
                'sett dato før ' +
                    formaterDato(
                        finnGrenserFor18MNDPeriode(dagensDatoDayjs).datoTil!
                    )
            );
            return false;
        }
        if (
            finnDato18MndTilbake(dato).isSameOrBefore(
                finnGrenserFor18MNDPeriode(dagensDatoDayjs).datoFra!
            )
        ) {
            setFeilmelding(
                'sett dato før ' +
                    formaterDato(
                        dayjs(
                            finnDato18MndFram(
                                finnGrenserFor18MNDPeriode(dagensDatoDayjs)
                                    .datoFra!
                            )
                        )
                    )
            );
            return false;
        } else {
            setFeilmelding('');
            return true;
        }
    };

    return (
        <div className={'kalkulator__topp'}>
            <Normaltekst className={'kalkulator__generell-info'}>
                Fra 1. november 2020 økte maksperioden en arbeidsgiver kan
                fritas fra sin lønnsplikt innenfor en periode på 18 måneder, fra
                26 til 49 uker.{' '}
                <Lenke
                    href={
                        'https://arbeidsgiver.nav.no/arbeidsgiver-permittering#narSkalJegUtbetaleLonn'
                    }
                >
                    Du kan lese mer om beregning av lønnsplikt ved permittering
                    her.
                </Lenke>
            </Normaltekst>
            <Undertittel>
                1. Angi hvilken 18 mnd periode du vil beregne
            </Undertittel>
            <div className={'kalkulator__18mnd-illustrasjon'}>
                <div className={'kalkulator__18mnd-illustrasjon-første-dag'}>
                    <Normaltekst>første dag:</Normaltekst>
                    <Normaltekst>
                        {formaterDato(
                            finnDato18MndTilbake(props.sisteDagIPeriode)
                        )}
                    </Normaltekst>
                </div>
                <div className={'kalkulator__18mnd-linje'}>
                    <Element className={'kalkulator__18mnd-illustrasjon-tekst'}>
                        18 måneder
                    </Element>
                </div>
                <Datovelger
                    tjenesteBestemtFeilmelding={feilMelding}
                    className={'initial-datovelger'}
                    overtekst={'Siste dag i perioden'}
                    onChange={(event) => {
                        if (datoValidering(event.currentTarget.value)) {
                            props.set18mndsPeriode(event.currentTarget.value);
                            props.setEndringAv('datovelger');
                        }
                    }}
                    value={dayjs(props.sisteDagIPeriode)}
                />
            </div>
            <div className={'kalkulator__velg-ny-periode-info'}>
                <img
                    alt={'kalender ikon'}
                    className={'kalkulator__ikon-kalender'}
                    src={kalender}
                />
                <div>
                    <Normaltekst>
                        {
                            'Permitteringsukene beregnes alltid i et tidsrom på 18 måneder av gangen.  Du kan endre 18 måneders perioden ved å bruke datovelgeren over til høyre.'
                        }
                    </Normaltekst>
                    <br />
                    <Normaltekst>
                        {`Dagen du har valgt som sluttdato for perioden er ${formaterDato(
                            dayjs(props.sisteDagIPeriode)
                        )}. 18 måneders perioden er tidsrommet fra og med ${formaterDato(
                            dayjs(finnDato18MndTilbake(props.sisteDagIPeriode))
                        )} til og med ${formaterDato(
                            dayjs(props.sisteDagIPeriode)
                        )} .`}
                    </Normaltekst>
                </div>
            </div>
        </div>
    );
};

export default Topp;
