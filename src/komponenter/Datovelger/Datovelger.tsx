import React, {
    FunctionComponent,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';
import { Collapse } from 'react-collapse';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import { Input, Label } from 'nav-frontend-skjema';
import { guid } from 'nav-frontend-js-utils';
import {
    datoValidering,
    formaterDato,
    LABELS,
    MONTHS,
    WEEKDAYS_LONG,
    WEEKDAYS_SHORT,
} from './datofunksjoner';
import kalender from './kalender.svg';
import './Datovelger.less';
import dayjs, { Dayjs } from 'dayjs';
import { PermitteringContext } from '../ContextProvider';

interface Props {
    overtekst: string;
    value?: Dayjs;
    onChange: (event: { currentTarget: { value: Dayjs } }) => void;
    disabled?: boolean;
    skalVareEtter?: Dayjs;
    skalVareFoer?: Dayjs;
    className?: string;
    tjenesteBestemtFeilmelding?: string;
}

const Datovelger: FunctionComponent<Props> = (props) => {
    const { dagensDato } = useContext(PermitteringContext);

    const datepickernode = useRef<HTMLDivElement>(null);
    const [erApen, setErApen] = useState(false);
    const [editing, setEditing] = useState(false);
    const selectedDate: Dayjs = props.value || dagensDato;
    const [tempDate, setTempDate] = useState(formaterDato(selectedDate));
    const [feilmelding, setFeilMelding] = useState('');

    const datovelgerId = guid();

    const tekstIInputfeltet = () => {
        if (props.value) {
            return editing ? tempDate : formaterDato(selectedDate);
        } else {
            return 'dd.mm.yyyy';
        }
    };

    const onDatoClick = (date: Dayjs) => {
        const nyFeilmelding = datoValidering(
            date,
            props.skalVareEtter,
            props.skalVareFoer
        );
        if (nyFeilmelding !== '') {
            setFeilMelding(nyFeilmelding);
        } else {
            props.onChange({
                currentTarget: {
                    value: date,
                },
            });
            setFeilMelding('');
        }
        setErApen(false);
    };

    const inputOnBlur = (event: any) => {
        setEditing(false);
        const newDato = dayjs(event.currentTarget.value, 'DD.MM.YYYY');
        if (newDato.isValid()) {
            onDatoClick(newDato);
        } else {
            setFeilMelding('dd.mm.yyyy');
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
        if (props.tjenesteBestemtFeilmelding?.length) {
            setFeilMelding(props.tjenesteBestemtFeilmelding);
        }
    }, [props.tjenesteBestemtFeilmelding]);

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
        <div ref={datepickernode} className={'datofelt ' + props.className}>
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
                    selectedDays={selectedDate.toDate()}
                    month={selectedDate.toDate()}
                    firstDayOfWeek={1}
                    onDayClick={(day: Date) => onDatoClick(dayjs(day))}
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
