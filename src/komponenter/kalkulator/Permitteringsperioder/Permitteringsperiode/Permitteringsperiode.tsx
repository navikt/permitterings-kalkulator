import React, { FunctionComponent, useContext, useState } from 'react';
import '../../kalkulator.less';
import './Permitteringsperiode.less';

import {
    AllePermitteringerOgFraværesPerioder,
    DatoIntervall,
} from '../../typer';

import DatoIntervallInput from '../../DatointervallInput/DatointervallInput';
import { Knapp } from 'nav-frontend-knapper';
import {
    datoIntervallErGyldig,
    finnDato18MndTilbake,
    finnSisteTilDato,
    getSenesteDatoAvTo,
    getTidligsteDato,
} from '../../utils/dato-utils';
import { PermitteringContext } from '../../../ContextProvider';

interface Props {
    indeks: number;
    allePermitteringerOgFraværesPerioder: AllePermitteringerOgFraværesPerioder;
    setAllePermitteringerOgFraværesPerioder: (
        allePermitteringerOgFraværesPerioder: AllePermitteringerOgFraværesPerioder
    ) => void;
}

const Permitteringsperiode: FunctionComponent<Props> = (props) => {
    const { dagensDato, innføringsdatoAGP2 } = useContext(PermitteringContext);
    const [
        advarselPermitteringForeldet,
        setAdvarselPermitteringForeldet,
    ] = useState('');
    const [uvalidertDatoIntervall, setUvalidertDatoIntervall] = useState<
        Partial<DatoIntervall>
    >({ datoFra: undefined, datoTil: undefined });

    const leggTilNyPermitteringsperiode = () => {
        const sisteUtfyltePermitteringsdag = finnSisteTilDato(
            props.allePermitteringerOgFraværesPerioder.permitteringer
        );
        const startdatoForNyPeriode = sisteUtfyltePermitteringsdag
            ? sisteUtfyltePermitteringsdag.add(1, 'day')
            : undefined;
        const nyPeriode: Partial<DatoIntervall> = {
            datoFra: startdatoForNyPeriode,
            datoTil: undefined,
        };

        const kopiAvPermitterinsperioder = {
            ...props.allePermitteringerOgFraværesPerioder,
        };
        kopiAvPermitterinsperioder.permitteringer.push(nyPeriode);
        props.setAllePermitteringerOgFraværesPerioder(
            kopiAvPermitterinsperioder
        );
    };

    const oppdaterDatoIntervall = (datoIntervall: Partial<DatoIntervall>) => {
        setUvalidertDatoIntervall(datoIntervall);
        if (datoIntervallErGyldig(datoIntervall)) {
            const grenseDato = getSenesteDatoAvTo(
                innføringsdatoAGP2,
                dagensDato
            );
            const datoErForGammel = getTidligsteDato([
                datoIntervall.datoFra,
                datoIntervall.datoTil,
            ])?.isBefore(finnDato18MndTilbake(grenseDato));

            if (datoErForGammel) {
                setAdvarselPermitteringForeldet(
                    'Permitteringer eldre enn 18 månder telles ikke med i beregningen'
                );
            } else {
                setAdvarselPermitteringForeldet('');
            }
            const kopiAvPermitteringsperioder = [
                ...props.allePermitteringerOgFraværesPerioder.permitteringer,
            ];
            kopiAvPermitteringsperioder[props.indeks] = datoIntervall;
            props.setAllePermitteringerOgFraværesPerioder({
                ...props.allePermitteringerOgFraværesPerioder,
                permitteringer: kopiAvPermitteringsperioder,
            });
        }
    };
    const slettPeriode = () => {
        let nyePermitteringsperioder = [
            ...props.allePermitteringerOgFraværesPerioder.permitteringer,
        ];
        if (nyePermitteringsperioder.length > 1) {
            nyePermitteringsperioder.splice(props.indeks, 1);
        } else {
            nyePermitteringsperioder = [
                { datoFra: undefined, datoTil: undefined },
            ];
        }
        props.setAllePermitteringerOgFraværesPerioder({
            ...props.allePermitteringerOgFraværesPerioder,
            permitteringer: nyePermitteringsperioder,
        });
    };

    return (
        <div className={'permitteringsperiode'}>
            <DatoIntervallInput
                datoIntervall={uvalidertDatoIntervall}
                setDatoIntervall={oppdaterDatoIntervall}
                slettPeriode={slettPeriode}
                advarsel={advarselPermitteringForeldet}
            />
            {props.indeks ===
                props.allePermitteringerOgFraværesPerioder.permitteringer
                    .length -
                    1 && (
                <Knapp
                    className={'permitteringsperiode__legg-til-knapp'}
                    onClick={leggTilNyPermitteringsperiode}
                >
                    + Legg til permittering
                </Knapp>
            )}
        </div>
    );
};

export default Permitteringsperiode;
