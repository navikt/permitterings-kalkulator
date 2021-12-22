import { DatointervallKategori, DatoMedKategori } from '../../typer';
import dayjs, { Dayjs } from 'dayjs';
import {
    finnDatoForMaksPermittering,
    finnStartDatoForPermitteringUtIfraSluttdato,
} from '../../utils/beregningerForRegelverksendring1Jan';
import { formaterDato } from '../../utils/dato-utils';

export const arbeidsgiverPotensieltStartetLønnspliktFør1Juli = (
    tidslinje: DatoMedKategori[],
    datoRegelEndring: Dayjs
): Dayjs | undefined => {
    const indeksITidslinjeFor1Juli = tidslinje.findIndex((dato) =>
        dato.dato.isSame(datoRegelEndring, 'day')
    );
    const permittertUtenLønn30Juni =
        tidslinje[indeksITidslinjeFor1Juli].kategori !==
        DatointervallKategori.IKKE_PERMITTERT;
    const maksPermitteringNådd49Uker = finnDatoForMaksPermittering(
        tidslinje,
        datoRegelEndring,
        49 * 7
    );
    if (maksPermitteringNådd49Uker) {
        const startDatoForPermitteringDerMaksNås = finnStartDatoForPermitteringUtIfraSluttdato(
            maksPermitteringNådd49Uker,
            tidslinje
        );
        if (startDatoForPermitteringDerMaksNås) {
            let forstePermitteringsDatoEtter1Juli = datoRegelEndring;
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
                }
            }
            if (
                (forstePermitteringsDatoEtter1Juli.isSame('date'),
                startDatoForPermitteringDerMaksNås)
            ) {
                const indeksMaksPermitteringsDatoNådd = tidslinje.findIndex(
                    (dato) => dato.dato.isSame(maksPermitteringNådd49Uker)
                );
                const datoForPermitteringsStart = finnStartDatoForPermitteringUtIfraSluttdato(
                    tidslinje[indeksMaksPermitteringsDatoNådd].dato,
                    tidslinje
                );
                const grenseDatoForLønnspliktPotensieltStartetFørNullstillingsDato = dayjs(
                    '09-01-2021'
                );
                if (
                    datoForPermitteringsStart.isBefore(
                        grenseDatoForLønnspliktPotensieltStartetFørNullstillingsDato,
                        'day'
                    )
                ) {
                    return datoForPermitteringsStart;
                }
            }
        }
    }

    return undefined;
};
