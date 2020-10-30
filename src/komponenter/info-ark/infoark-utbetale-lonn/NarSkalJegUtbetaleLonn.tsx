import React /*useState*/ from 'react';
/*import BEMHelper from '../../../utils/bem';
import Tekstseksjon from '../../infoseksjon/Tekstseksjon';*/
import {
    SanityBlockTypes,
    NarSkalJegUtbetaleIllustration,
} from '../../../sanity-blocks/sanityTypes';
import SanityInnhold from '../../../sanity-blocks/SanityInnhold';
import Infoseksjon from '../../infoseksjon/Infoseksjon';
/*import NarSkalJegUtbetaleIllustrasjon from '../../illustrasjon/NarSkalJegUtbetaleIllustrasjon';
import { RadioPanelGruppe } from 'nav-frontend-skjema';*/

interface Props {
    className: string;
    illustrasjon: NarSkalJegUtbetaleIllustration | null;
    content: SanityBlockTypes[];
    contentEtter: SanityBlockTypes[];
    overskrift: string;
    id: string;
}

export type Situasjon = 'before' | 'after';

const NarSkalJegUtbetaleLonn = (props: Props) => {
    // const cls = BEMHelper(props.className);

    //    const [situasjon, setSituasjon] = useState<Situasjon>('before');
    /*const toggleSituasjon = () =>
        setSituasjon(situasjon === 'before' ? 'after' : 'before');*/

    return (
        <Infoseksjon
            className={props.className}
            overskrift={props.overskrift}
            id={props.id}
        >
            <SanityInnhold textdocument={props.content} />
            {/*
            <div className={cls.element('avsnitt', 'topmodifier')}>
                <Tekstseksjon tittel="Hvor lenge skal jeg betale lønn?">
                    <div className={cls.element('radiogruppe')}>
                        <RadioPanelGruppe
                            name="test"
                            legend="Når permitterte du ansatte?"
                            radios={[
                                {
                                    label: '31. august eller tidligere',
                                    value: 'before',
                                    id: 'before',
                                },
                                {
                                    label: 'Etter 31. august',
                                    value: 'after',
                                    id: 'after',
                                },
                            ]}
                            checked={situasjon}
                            onChange={toggleSituasjon}
                        />
                    </div>
                    <NarSkalJegUtbetaleIllustrasjon
                        innhold={props.illustrasjon}
                        situasjon={situasjon}
                    />
                </Tekstseksjon>
                {situasjon === 'before' ? (
                    <SanityInnhold textdocument={props.content} />
                ) : (
                    <SanityInnhold textdocument={props.contentEtter} />
                )}
            </div>*/}
        </Infoseksjon>
    );
};

export default NarSkalJegUtbetaleLonn;
