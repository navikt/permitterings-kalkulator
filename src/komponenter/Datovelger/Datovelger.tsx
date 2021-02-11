import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import { Collapse } from 'react-collapse';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import { Input, Label } from 'nav-frontend-skjema';
import { guid } from 'nav-frontend-js-utils';
import {
    datoValidering,
    LABELS,
    MONTHS,
    skrivOmDato,
    skrivOmDatoStreng,
    WEEKDAYS_LONG,
    WEEKDAYS_SHORT,
} from './datofunksjoner';
import kalender from './kalender.svg';
import './Datovelger.less';

interface Props {
    overtekst: string;
    value?: Date;
    onChange: (event: any) => void;
    disabled?: boolean;
    skalVareEtter?: Date;
    skalVareFoer?: Date;
}

const Datovelger: FunctionComponent<Props> = (props) => {
    const datepickernode = useRef<HTMLDivElement>(null);
    const [erApen, setErApen] = useState(false);
    const [editing, setEditing] = useState(false);
    const selectedDate = new Date(props.value || new Date());
    const [tempDate, setTempDate] = useState(skrivOmDato(selectedDate));
    const [feilmelding, setFeilMelding] = useState('');

    const datovelgerId = guid();

    const tekstIInputfeltet = () => {
        if (props.value) {
            return editing ? tempDate : skrivOmDato(selectedDate);
        } else {
            return 'dd/mm/yyyy';
        }
    };

    const onDatoClick = (day: Date) => {
        console.log('datoklikk på ', props.overtekst, skrivOmDato(day));
        const nyFeilmelding = datoValidering(
            day,
            props.skalVareEtter,
            props.skalVareFoer
        );
        if (nyFeilmelding !== '') {
            setFeilMelding(nyFeilmelding);
        } else {
            props.onChange({
                currentTarget: {
                    value: day,
                },
            });
            setFeilMelding('');
        }
        setErApen(false);
    };

    const inputOnBlur = (event: any) => {
        setEditing(false);
        const newDato = skrivOmDatoStreng(event.currentTarget.value);
        if (newDato) {
            onDatoClick(newDato);
        } else {
            setFeilMelding('dd/mm/yyyy');
            setErApen(false);
        }
    };

    const handleOutsideClick: { (event: MouseEvent): void } = (
        e: MouseEvent
    ) => {
        const node = datepickernode.current;
        // @ts-ignore
        if (node && node.contains(e.target as HTMLElement)) {
            return;
        }
        setErApen(false);
    };

    useEffect(() => {
        const verdi = props.skalVareFoer
            ? props.skalVareFoer
            : props.skalVareEtter;
        if (verdi) {
            setFeilMelding(
                datoValidering(verdi, props.skalVareEtter, props.skalVareFoer)
            );
        }
    }, [props.skalVareEtter, props.skalVareFoer]);

    useEffect(() => {
        if (erApen) {
            setFeilMelding('');
        }
    }, [erApen]);

    useEffect(() => {
        document.addEventListener('click', handleOutsideClick, false);
        return () => {
            window.removeEventListener('click', handleOutsideClick, false);
        };
    }, []);

    return (
        <div ref={datepickernode} className={'datofelt'}>
            <Label htmlFor={datovelgerId}>{props.overtekst}</Label>
            <div className={'datofelt__input-container'}>
                <Input
                    feil={feilmelding}
                    disabled={props.disabled}
                    id={datovelgerId}
                    aria-label="Skriv startdato:"
                    value={tekstIInputfeltet()}
                    className={'datofelt__input'}
                    onChange={(event) => {
                        setEditing(true);
                        setTempDate(event.currentTarget.value);
                    }}
                    onBlur={(event) => {
                        inputOnBlur(event);
                    }}
                />
                <button
                    disabled={props.disabled}
                    className={'datofelt__knapp'}
                    onClick={() => setErApen(!erApen)}
                >
                    <img alt={''} src={kalender} />
                </button>
            </div>
            <Collapse isOpened={erApen}>
                <DayPicker
                    className={'datofelt__collapse'}
                    selectedDays={selectedDate}
                    month={selectedDate}
                    firstDayOfWeek={1}
                    onDayClick={(day) => onDatoClick(day)}
                    months={MONTHS['no']}
                    weekdaysLong={WEEKDAYS_LONG['no']}
                    weekdaysShort={WEEKDAYS_SHORT['no']}
                    labels={LABELS['no']}
                />
            </Collapse>
        </div>
    );
};

export default Datovelger;
