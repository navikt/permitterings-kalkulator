import React, {
    FunctionComponent,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';
import './Utregningskolonne.less';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import {
    AllePermitteringerOgFraværesPerioder,
    AllePermitteringerOgFraværesPerioderDayjs,
    DatoIntervall,
    DatoIntervallDayjs,
    OversiktOverBrukteOgGjenværendeDager,
    tilAllePermitteringerOgFraværesPerioder,
    tilDatoIntervall,
} from '../typer';
import UtregningAvEnkelPeriode from './UtregningAvEnkelPeriode/UtregningAvEnkelPeriode';
import {
    finnDato18MndTilbake,
    finnDato18MndTilbakeDayjs,
    kuttAvDatoIntervallInnefor18mnd,
    kuttAvDatoIntervallInnefor18mndDayjs,
    sumPermitteringerOgFravær,
    sumPermitteringerOgFraværDayjs,
} from '../utregninger';
import { PermitteringContext } from '../../ContextProvider';
import { Dayjs } from 'dayjs';

interface UtregningskolonneProps {
    allePermitteringerOgFraværesPerioder: AllePermitteringerOgFraværesPerioderDayjs;
    sisteDagIPeriode: Dayjs;
}

const Utregningskolonne: FunctionComponent<UtregningskolonneProps> = (
    props
) => {
    const [
        oversiktOverPerioderInnenfor18mnd,
        setOversiktOverPerioderInnenfor18mnd,
    ] = useState<AllePermitteringerOgFraværesPerioderDayjs>({
        andreFraværsperioder: [],
        permitteringer: [],
    });
    const { dagensDatoDayjs } = useContext(PermitteringContext);

    const resultatUtregningAv18mndsPeriode = useRef<OversiktOverBrukteOgGjenværendeDager>(
        {
            dagerPermittert: 0,
            dagerAnnetFravær: 0,
            dagerGjensående: 0,
        }
    );

    useEffect(() => {
        const avkuttet18mndPerioder: AllePermitteringerOgFraværesPerioderDayjs = {
            andreFraværsperioder:
                props.allePermitteringerOgFraværesPerioder.andreFraværsperioder,
            permitteringer: [],
        };
        props.allePermitteringerOgFraværesPerioder.permitteringer.forEach(
            (periode) => {
                const kuttetDatoIntervall: DatoIntervallDayjs = kuttAvDatoIntervallInnefor18mndDayjs(
                    periode,
                    finnDato18MndTilbakeDayjs(props.sisteDagIPeriode),
                    props.sisteDagIPeriode
                );
                avkuttet18mndPerioder.permitteringer.push(kuttetDatoIntervall);
            }
        );
        setOversiktOverPerioderInnenfor18mnd(avkuttet18mndPerioder);
        resultatUtregningAv18mndsPeriode.current = sumPermitteringerOgFraværDayjs(
            oversiktOverPerioderInnenfor18mnd,
            dagensDatoDayjs
        );
    }, [props.allePermitteringerOgFraværesPerioder, props.sisteDagIPeriode]);

    const enkeltUtregninger = oversiktOverPerioderInnenfor18mnd.permitteringer.map(
        (permitteringsperiode, indeks) => {
            return (
                <UtregningAvEnkelPeriode
                    permitteringsperiode={tilDatoIntervall(
                        permitteringsperiode
                    )}
                    indeks={indeks}
                    allePermitteringerOgFraværesPerioder={tilAllePermitteringerOgFraværesPerioder(
                        oversiktOverPerioderInnenfor18mnd
                    )}
                    key={indeks}
                />
            );
        }
    );

    const heleUkerPermittert = Math.floor(
        resultatUtregningAv18mndsPeriode.current.dagerPermittert / 7
    );
    const restIDager =
        resultatUtregningAv18mndsPeriode.current.dagerPermittert % 7;

    return (
        <div className={'utregningskolonne'}>
            {enkeltUtregninger}
            <div className={'utregningskolonne__total-alle-perioder'}>
                <Normaltekst>Permittert i</Normaltekst>
                <Element>
                    {`${heleUkerPermittert} uker og ${restIDager} dager`}
                </Element>
                {resultatUtregningAv18mndsPeriode.current.dagerPermittert >
                    0 && (
                    <>
                        {resultatUtregningAv18mndsPeriode.current
                            .dagerPermittert >
                            49 * 7 && (
                            <Element>
                                {'Permitteringen overskrider 49 uker'}
                            </Element>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Utregningskolonne;
