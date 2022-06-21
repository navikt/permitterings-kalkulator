import React, { FunctionComponent } from 'react';
import { DatoMedKategori } from '../../../typer';
import { Dayjs } from 'dayjs';
import './Tekstforklaring.less';
import { Normaltekst } from 'nav-frontend-typografi';
import { skrivDagerIHeleUkerPlussDager } from '../../../SeResultat/Utregningstekst/utregningstekst-avvikling-av-koronaregler-utils';
import { getPermitteringsoversiktFor18Måneder } from '../../../utils/beregningerForSluttPåDagpengeforlengelse';
import { Ingress, Heading } from '@navikt/ds-react';

interface Props {
    tidslinje: DatoMedKategori[];
    datoVisesPaDragElement: Dayjs;
}

const Tekstforklaring: FunctionComponent<Props> = (props) => {
    const oversiktOverPermitteringi18mndsperiode = getPermitteringsoversiktFor18Måneder(
        props.tidslinje,
        props.datoVisesPaDragElement
    ).dagerBrukt;

    return (
        <div className="tidslinje__tekstforklaring">
            <Heading
                spacing
                size="small"
                level="4"
                className={'tidslinje__tekstforklaring-element'}
            >
                Illustrasjonen viser permitteringsperiodene du har plottet inn
                og plasserer de i en tidslinje.
            </Heading>
            <Ingress
                className={'kalkulator__tidslinje-drag-element-forklaring'}
            >
                Permittering i den markerte 18-månedersperioden:{' '}
                {skrivDagerIHeleUkerPlussDager(
                    oversiktOverPermitteringi18mndsperiode
                )}{' '}
                ({oversiktOverPermitteringi18mndsperiode} dager).
            </Ingress>
            <Normaltekst className={'tidslinje__drag-element-instruks'}>
                <b>Tips:</b> Du kan dra det blå drag-elementet for å se hvor
                mange permitteringsdager som er innenfor en bestemt
                18-månedersperiode.
            </Normaltekst>
        </div>
    );
};

export default Tekstforklaring;
