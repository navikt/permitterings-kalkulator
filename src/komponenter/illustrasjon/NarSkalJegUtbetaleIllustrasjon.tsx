import React from 'react';
import { NarSkalJegUtbetaleIllustration } from '../../sanity-blocks/sanityTypes';
import BEMHelper from '../../utils/bem';
import BlockContent from '@sanity/block-content-to-react';
import { serializers } from '../../sanity-blocks/serializer';
import { Undertittel } from 'nav-frontend-typografi';
import './narSkalJegUtbetaleIllustrasjon.less';
import { Situasjon } from '../info-ark/infoark-utbetale-lonn/NarSkalJegUtbetaleLonn';

interface Props {
    innhold: NarSkalJegUtbetaleIllustration | null;
    situasjon: Situasjon;
}

const cls = BEMHelper('narSkalJegUtbetaleIllustrasjon');

const NarSkalJegUtbetaleIllustrasjon = (props: Props) => {
    const { innhold } = props;
    const setIllustrasjon = (key: Situasjon) =>
        innhold
            ? key === 'before'
                ? innhold.illustrationBefore
                : innhold.illustrationAfter
            : [];

    return innhold ? (
        <div className={cls.className}>
            {setIllustrasjon(props.situasjon).map((element, index) => {
                return (
                    <div className={cls.element('liste-element')} key={index}>
                        <div className={cls.element('image')}>
                            <BlockContent
                                blocks={element.iconImage}
                                serializers={serializers}
                            />
                        </div>
                        <div className={cls.element('txt-container')}>
                            <div>
                                <Undertittel className={cls.element('title')}>
                                    {element.title}
                                </Undertittel>
                            </div>
                            <div>
                                <BlockContent
                                    blocks={element.body}
                                    serializers={serializers}
                                />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    ) : null;
};

export default NarSkalJegUtbetaleIllustrasjon;
