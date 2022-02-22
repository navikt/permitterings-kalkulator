import { DatointervallKategori, DatoMedKategori } from '../../typer';
import dayjs, { Dayjs } from 'dayjs';
import { formaterDato } from '../../utils/dato-utils';
import { finnDatoForMaksPermitteringNormaltRegelverk } from '../../utils/beregningForMaksPermitteringsdagerNormaltRegelverk';
import {
    finnDatoForMaksPermitteringVedAktivPermitteringFør1Juli,
    finnStartDatoForPermitteringUtIfraSluttdato,
} from '../../utils/beregningerForSluttPåDagpengeforlengelse';
import { finnSisteDatoMedPermitteringUtenFravær } from '../../utils/tidslinje-utils';

export const arbeidsgiverPotensieltStartetLønnspliktFør1Juli = (
    tidslinje: DatoMedKategori[],
    datoRegelEndring: Dayjs,
    forsteJuli: Dayjs
): boolean => {
    const grenseDatoForLønnspliktPotensieltStartetFørNullstillingsDato = dayjs(
        '09-01-2021'
    );
    const sistePermittering = finnSisteDatoMedPermitteringUtenFravær(tidslinje);
    const permitteringsStart = finnStartDatoForPermitteringUtIfraSluttdato(
        sistePermittering,
        tidslinje
    );

    return (
        permitteringsStart.isSameOrBefore(
            grenseDatoForLønnspliktPotensieltStartetFørNullstillingsDato,
            'day'
        ) && permitteringsStart.isSameOrAfter(forsteJuli, 'day')
    );
};
