import { DatointervallKategori, DatoMedKategori } from '../../typer';
import dayjs, { Dayjs } from 'dayjs';
import {
    finnDatoForMaksPermittering,
    finnStartDatoForPermitteringUtIfraSluttdato,
} from '../../utils/beregningerForRegelverksendring1Jan';
import { formaterDato } from '../../utils/dato-utils';
import { finnDatoForMaksPermitteringNormaltRegelverk } from '../../utils/beregningForMaksPermitteringsdagerNormaltRegelverk';

export const arbeidsgiverPotensieltStartetLønnspliktFør1Juli = (
    tidslinje: DatoMedKategori[],
    datoRegelEndring: Dayjs,
    forsteJuli: Dayjs
): Dayjs | undefined => {
    const indeksITidslinjeFor1Juli = tidslinje.findIndex((dato) =>
        dato.dato.isSame(forsteJuli, 'day')
    );
    const maksPermitteringNådd49Uker = finnDatoForMaksPermittering(
        tidslinje,
        datoRegelEndring,
        49 * 7
    );
    const maksPermitteringNådd26Uker = finnDatoForMaksPermitteringNormaltRegelverk(
        tidslinje,
        datoRegelEndring,
        26 * 7
    );
    if (maksPermitteringNådd49Uker || maksPermitteringNådd26Uker) {
        let startDatoForPermitteringDerMaksNås;
        if (maksPermitteringNådd49Uker) {
            startDatoForPermitteringDerMaksNås = finnStartDatoForPermitteringUtIfraSluttdato(
                maksPermitteringNådd49Uker,
                tidslinje
            );
        } else {
            startDatoForPermitteringDerMaksNås = finnStartDatoForPermitteringUtIfraSluttdato(
                maksPermitteringNådd26Uker!!,
                tidslinje
            );
        }
        if (startDatoForPermitteringDerMaksNås) {
            let forstePermitteringsDatoEtter1Juli = forsteJuli;
            let iteratorIndeks = indeksITidslinjeFor1Juli;
            while (
                forstePermitteringsDatoEtter1Juli.isSameOrBefore(
                    startDatoForPermitteringDerMaksNås
                )
            ) {
                iteratorIndeks++;
                if (
                    tidslinje[iteratorIndeks].kategori !==
                    DatointervallKategori.IKKE_PERMITTERT
                ) {
                    forstePermitteringsDatoEtter1Juli =
                        tidslinje[iteratorIndeks].dato;
                    break;
                }
            }
            if (
                forstePermitteringsDatoEtter1Juli.isSame(
                    startDatoForPermitteringDerMaksNås,
                    'date'
                )
            ) {
                const grenseDatoForLønnspliktPotensieltStartetFørNullstillingsDato = dayjs(
                    '09-01-2021'
                );
                if (
                    startDatoForPermitteringDerMaksNås.isBefore(
                        grenseDatoForLønnspliktPotensieltStartetFørNullstillingsDato,
                        'day'
                    )
                ) {
                    return startDatoForPermitteringDerMaksNås;
                }
            }
        }
    }
    return undefined;
};
