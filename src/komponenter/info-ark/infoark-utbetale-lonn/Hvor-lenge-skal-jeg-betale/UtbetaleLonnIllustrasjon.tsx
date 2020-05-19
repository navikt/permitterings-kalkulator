import React from 'react';
import BEMHelper from '../../../../utils/bem';
import { ReactComponent as BlattTrinnSVG } from '../../../../assets/ikoner/blattTrinn.svg';
import { ReactComponent as GrattTrinnDagpenger } from '../../../../assets/ikoner/grattTrinnDagpenger.svg';
import { ReactComponent as GrattTrinnLonnskompensasjon } from '../../../../assets/ikoner/grattTrinnLonnskompensasjon.svg';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import './UtbetaleLonnIllustrasjon.less';

interface Steg {
    svg: React.ReactNode;
    tittel: string;
    tekst: string[];
}

const utbetalingSteg: Steg[] = [
    {
        svg: <BlattTrinnSVG />,
        tittel: 'Varsle ansatte om permittering',
        tekst: [
            'Du betaler lønn som vanlig i varslingsperioden som er minst to dager.',
        ],
    },
    {
        svg: <BlattTrinnSVG />,
        tittel: 'Permitteringen starter',
        tekst: [
            'Du betaler lønn som vanlig de to første dagene av permitteringen.',
        ],
    },
    {
        svg: <GrattTrinnLonnskompensasjon />,
        tittel: 'Lønnskompensasjon fra NAV til arbeidstaker',
        tekst: [
            'NAV betaler lønn opp til 6G for dagene 3 - 20 til arbeidstaker.',
            'NAV utvikler en løsning der arbeidsgiver gir opplysninger om arbeidsforholdet til NAV. Dette innebærer at arbeidstaker ikke trenger søke om lønnskompensasjon. Løsningen er ventet å være klar i midten av juni.',
        ],
    },
    {
        svg: <GrattTrinnDagpenger />,
        tittel: 'Dagpenger ved permittering',
        tekst: ['Arbeidstaker søker om dagpenger fra NAV fra dag 21.'],
    },
];

const UtbetaleLonnIllustrasjon = () => {
    const cls = BEMHelper('utbetalingIllustrasjon');
    return (
        <>
            <div className={cls.className}>
                {utbetalingSteg.map((element: Steg) => (
                    <div className={cls.element('rad')}>
                        <div className={cls.element('svg')}>{element.svg}</div>
                        <div className={cls.element('txt-col')}>
                            <Undertittel className={cls.element('tittel')}>
                                {element.tittel}
                            </Undertittel>
                            {element.tekst.map((element: string) => (
                                <Normaltekst>{element}</Normaltekst>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default UtbetaleLonnIllustrasjon;
