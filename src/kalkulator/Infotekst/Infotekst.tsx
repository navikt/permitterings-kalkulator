import React, { FunctionComponent } from 'react';
import './Infotekst.less';
import classNames from 'classnames';

interface Props {
    imgSrc: string;
    imgAlt: string;
    className?: string;
}

export const Infotekst: FunctionComponent<Props> = (props) => {
    return (
        <div className={classNames('infotekst', props.className)}>
            <img
                src={props.imgSrc}
                alt={props.imgAlt}
                className="infotekst__ikon"
            />
            <div className={'infotekst__children-wrapper'}>
                {props.children}
            </div>
        </div>
    );
};
