import React from 'react';
import Lenke from 'nav-frontend-lenker';
import { Normaltekst } from 'nav-frontend-typografi';
import { permitteringClassName } from '../../Permittering';
import BEMHelper from '../../../utils/bem';
import { skrivTilMalingBrukerTrykketPaSporsmal } from '../../../utils/amplitudeUtils';

interface Props {
    hopplenker: { tittel: string; id: string }[];
}

const VanligeSporsmalHopplenker = (props: Props) => {
    const cls = BEMHelper(permitteringClassName);
    return (
        <>
            <div>
                {props.hopplenker.map((lenke) => {
                    return (
                        <div
                            key={lenke.id}
                            className={cls.element('lenke-modifier')}
                        >
                            <Normaltekst>
                                <Lenke
                                    href={lenke.id}
                                    onClick={() =>
                                        skrivTilMalingBrukerTrykketPaSporsmal(
                                            lenke.id.slice(1)
                                        )
                                    }
                                >
                                    {lenke.tittel}
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
