import React from 'react';
import BEMHelper from '../../../utils/bem';
import './menyknapp.less';

interface Button {
    on: boolean;
    change: () => void;
    width: number;
}

const cls = BEMHelper('menyknapp');

const Menyknapp = (button: Button) => {
    return (
        <div className={cls.className} style={{ right: `${button.width}px` }}>
            <div
                className={cls.element('button', !button.on ? '' : 'on')}
                role="button"
                onClick={button.change}
            >
                <span />
                <span />
                <span />
            </div>
        </div>
    );
};

export default Menyknapp;
