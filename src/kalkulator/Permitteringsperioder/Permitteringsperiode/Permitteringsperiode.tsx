import React, { FunctionComponent, useContext, useState } from 'react';
import '../../kalkulator.less';
import './Permitteringsperiode.less';

import {
    AllePermitteringerOgFraværesPerioder,
    DatoIntervall,
} from '../../typer';

import DatoIntervallInput from '../../DatointervallInput/DatointervallInput';
import {
    finnDato18MndFram,
    finnDato18MndTilbake,
    getSenesteDato,
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
    const { dagensDato } = useContext(PermitteringContext);
    const [
        advarselPermitteringForeldet,
        setAdvarselPermitteringForeldet,
    ] = useState('');
    const [
        advarselPermitteringForLangIFramtiden,
        setAdvarselPermitteringForLangtIFramtiden,
    ] = useState('');

    const oppdaterDatoIntervall = (datoIntervall: Partial<DatoIntervall>) => {
        const datoErForGammel = getTidligsteDato([
            datoIntervall.datoFra,
            datoIntervall.datoTil,
        ])?.isBefore(finnDato18MndTilbake(dagensDato));
        const datoErForLangtIFramtiden = getSenesteDato([
            datoIntervall.datoFra,
            datoIntervall.datoTil,
        ])?.isAfter(finnDato18MndFram(dagensDato));

        if (datoErForGammel) {
            setAdvarselPermitteringForeldet(
                'Permitteringer eldre enn 18 månder telles ikke med i beregningen'
            );
        } else {
            setAdvarselPermitteringForeldet('');
        }
        if (datoErForLangtIFramtiden) {
            setAdvarselPermitteringForLangtIFramtiden(
                'Du kan ikke planlegge permitteringer langt fram i tid'
            );
        } else {
            setAdvarselPermitteringForLangtIFramtiden('');
        }
        const kopiAvPermitteringsperioder = [
            ...props.allePermitteringerOgFraværesPerioder.permitteringer,
        ];
        kopiAvPermitteringsperioder[props.indeks] = datoIntervall;
        props.setAllePermitteringerOgFraværesPerioder({
            ...props.allePermitteringerOgFraværesPerioder,
            permitteringer: kopiAvPermitteringsperioder,
        });
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
                kanVæreLøpende={true}
                datoIntervall={
                    props.allePermitteringerOgFraværesPerioder.permitteringer[
                        props.indeks
                    ]
                }
                setDatoIntervall={oppdaterDatoIntervall}
                slettPeriode={slettPeriode}
                advarsel={
                    advarselPermitteringForeldet +
                    advarselPermitteringForLangIFramtiden
                }
            />
        </div>
    );
};

export default Permitteringsperiode;
