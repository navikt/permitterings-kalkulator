import React, { FunctionComponent } from 'react';
import { Knapp, KnappBaseProps } from 'nav-frontend-knapper';
import { ReactComponent as Kryss } from './kryss.svg';
import './Sletteknapp.less';

type Props = {
    onClick: (e: any) => void;
} & KnappBaseProps;

export const Sletteknapp: FunctionComponent<Props> = (props) => (
    <Knapp mini={true} {...props}>
        <Kryss className="sletteknapp__kryss" /> Fjern
    </Knapp>
);
