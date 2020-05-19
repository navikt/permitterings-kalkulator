import React from 'react';
import BEMHelper from '../../../utils/bem';
import Tekstseksjon from '../../infoseksjon/Tekstseksjon';
import HvorLengeSkalJegBetaleLonn from './tekster/HvorLengeSkalJegBetaleLonn';
import DuMaIkkeForskuttereLonn from './tekster/DuMaIkkeForskuttereLonn';
import TilbakebetalingAvUtbetaltLonn from './tekster/TilbakebetalingAvUtbetaltLonn';
import UtbetaleLonnIllustrasjon from './Hvor-lenge-skal-jeg-betale/UtbetaleLonnIllustrasjon';
import { Normaltekst, UndertekstBold } from 'nav-frontend-typografi';

interface Props {
    className: string;
}

const NarSkalJegUtbetaleLonn = (props: Props) => {
    const cls = BEMHelper(props.className);
    return (
        <div className={cls.element('avsnitt', 'topmodifier')}>
            <Tekstseksjon tittel="Hvor lenge skal jeg betale lønn?">
                <UtbetaleLonnIllustrasjon />
            </Tekstseksjon>
            <Tekstseksjon tittel="Lønnskompensasjon  fra NAV til arbeidstaker">
                <Normaltekst>
                    NAV jobber med en løsning der arbeidsgiver gir informasjon
                    til NAV om hvem som skal ha lønnskompesasjon og hvor mye de
                    skal ha. Dette innebærer at arbeidstaker ikke trenger å søke
                    om lønnskompensasjon. Løsningen er ventet å være klar i
                    midten av juni. Vi kommer med mer informasjon når det er
                    klar.
                </Normaltekst>
            </Tekstseksjon>
            <Tekstseksjon>
                <UndertekstBold>
                    Du skal ikke forskuttere lønn for permitteringer
                </UndertekstBold>
                <Normaltekst>
                    Du skal ikke forskuttere lønn til ansatte for dag 3-20 for
                    permitteringer som startet 20. april eller senere. NAV
                    refunderer ikke lønn for permitteringer som starter etter
                    denne datoen. Når du ikke betaler lønn skal arbeidsgiver gi
                    opplysninger til NAV slik at vi kan utbetale
                    lønnskompensasjon direkte til arbeidstaker.
                </Normaltekst>
            </Tekstseksjon>
            <Tekstseksjon>
                <UndertekstBold>
                    Refusjon av utbetalt lønn etter 2.permitteringsdag
                </UndertekstBold>
                <Normaltekst>
                    Du skal kun betale lønn de to første dagene etter at
                    permitteringen har begynt. Har du forskuttert lønn til
                    ansatte i de neste 18 kalenderdagene kan du søke om å få
                    disse pengene tilbake. Dette gjelder kun
                    permitteringsperioder som startet før 20. april. Ansatte som
                    ble permittert etter denne datoen vil få lønnskompensasjon
                    direkte fra NAV.
                </Normaltekst>
                <Normaltekst>
                    Vi dekker ikke lønn som er høyere enn seks ganger
                    grunnbeløpet. Er den ansatte delvis permittert, for eksempel
                    50 prosent, får du dekket 50 prosent av lønnsutgiftene dine.
                    Du må søke senest 31. oktober 2020 dersom du vil ha
                    refundert lønn du har utbetalt til permitterte fra 20. mars.
                    Vi jobber med en søknad og kommer med mer informasjon når
                    den er klar.
                </Normaltekst>
            </Tekstseksjon>

            <Tekstseksjon tittel="Permitteringen starter">
                <HvorLengeSkalJegBetaleLonn />
            </Tekstseksjon>
            <Tekstseksjon tittel="Du må ikke forskuttere lønn for permitteringer som starter fra 20.april">
                <DuMaIkkeForskuttereLonn />
            </Tekstseksjon>
            <Tekstseksjon tittel="Refusjon av utbetalt lønn etter 2. permitteringsdag">
                <TilbakebetalingAvUtbetaltLonn />
            </Tekstseksjon>
        </div>
    );
};

export default NarSkalJegUtbetaleLonn;
