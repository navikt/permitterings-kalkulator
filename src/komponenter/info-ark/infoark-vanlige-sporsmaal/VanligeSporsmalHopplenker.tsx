import React from 'react';
import Lenke from 'nav-frontend-lenker';
import { Normaltekst } from 'nav-frontend-typografi';
import { permitteringClassName } from '../../Permittering';
import BEMHelper from '../../../utils/bem';
import { skrivTilMalingBrukerTrykketPaSporsmal } from '../../../utils/amplitudeUtils';
import { SanityBlockTypes } from '../../../sanity-blocks/sanityTypes';

interface Props {
    content: SanityBlockTypes[];
}

const VanligeSporsmalHopplenker = (props: Props) => {
    const cls = BEMHelper(permitteringClassName);
    return (
        <>
            <div>
                {props.content.map((lenke, index) => {
                    return (
                        <div
                            key={index}
                            className={cls.element('lenke-modifier')}
                        >
                            <Normaltekst>
                                <Lenke
                                    id={lenke.title
                                        .concat('Id:')
                                        .concat(lenke._id)}
                                    href={'#'.concat(lenke._id)}
                                    onClick={() =>
                                        skrivTilMalingBrukerTrykketPaSporsmal(
                                            lenke.title
                                        )
                                    }
                                >
                                    {lenke.title}
                                </Lenke>
                            </Normaltekst>
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default VanligeSporsmalHopplenker;
