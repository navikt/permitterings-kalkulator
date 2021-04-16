import React, {
    FunctionComponent,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';
import { UnmountClosed } from 'react-collapse';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import { Input, Label } from 'nav-frontend-skjema';
import { guid } from 'nav-frontend-js-utils';
import {
    datoValidering,
    LABELS,
    MONTHS,
    WEEKDAYS_LONG,
    WEEKDAYS_SHORT,
} from './datovelger-utils';
import kalender from './kalender.svg';
import './Datovelger.less';
import dayjs, { Dayjs } from 'dayjs';
import { PermitteringContext } from '../ContextProvider';
import { formaterDato } from '../kalkulator/utils/dato-utils';

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
    const knappRef = useRef<HTMLButtonElement>(null);
    const [erApen, setErApen] = useState(false);
    const [editing, setEditing] = useState(false);
    const selectedDate: Dayjs = props.value || dagensDato;
    const [tempDate, setTempDate] = useState(formaterDato(selectedDate));
    const [feilmelding, setFeilMelding] = useState('');

    const datovelgerId = guid();

    const tekstIInputfeltet = () => {
        if (!editing && !props.value) {
            return 'dd.mm.yyyy';
        }
        return editing ? tempDate : formaterDato(selectedDate);
    };

    const velgDato = (date: Dayjs) => {
        props.onChange({
            currentTarget: {
                value: date,
            },
        });
        const nyFeilmelding = datoValidering(
            date,
            props.skalVareEtter,
            props.skalVareFoer
        );
        if (nyFeilmelding !== '') {
            setFeilMelding(nyFeilmelding);
        } else {
            setFeilMelding('');
        }
        setErApen(false);
        knappRef?.current?.focus();
    };

    const inputOnBlur = (event: any) => {
        setEditing(false);
        const newDato = dayjs(event.currentTarget.value, 'DD.MM.YYYY');
        if (newDato.isValid()) {
            velgDato(newDato);
        } else if (tekstIInputfeltet() !== 'dd.mm.yyyy') {
            setFeilMelding('dd.mm.yyyy');
            setErApen(false);
        }
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
        if (props.disabled) {
            setFeilMelding('');
        }
    }, [props.tjenesteBestemtFeilmelding, props.disabled]);

    useEffect(() => {
        if (erApen) {
            setFeilMelding('');
        }
    }, [erApen]);

    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            const node = datepickernode.current;
            // @ts-ignore
            if (node && node.contains(e.target as HTMLElement)) {
                return;
            }
            if (erApen) {
                setErApen(false);
                knappRef?.current?.focus();
            }
        };
        document.addEventListener('click', handleOutsideClick, false);
        return () => {
            document.removeEventListener('click', handleOutsideClick, false);
        };
    }, [erApen, setErApen]);

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
                    aria-label={'Velg' + props.overtekst + ' dato'}
                    disabled={props.disabled}
                    className={'datofelt__knapp'}
                    onClick={() => setErApen(!erApen)}
                    ref={knappRef}
                >
                    <img alt={''} src={kalender} />
                </button>
            </div>
            <UnmountClosed isOpened={erApen}>
                <DayPicker
                    onKeyDown={(e) => {
                        if (e.key === 'Escape') {
                            setErApen(false);
                        }
                    }}
                    className={'datofelt__collapse'}
                    selectedDays={selectedDate.toDate()}
                    month={selectedDate.toDate()}
                    firstDayOfWeek={1}
                    onDayKeyDown={(date, modifiers, e) => {
                        if (e.key === 'Tab') {
                            setErApen(!erApen);
                        }
                    }}
                    onDayClick={(day: Date) => velgDato(dayjs(day))}
                    months={MONTHS['no']}
                    weekdaysLong={WEEKDAYS_LONG['no']}
                    weekdaysShort={WEEKDAYS_SHORT['no']}
                    labels={LABELS['no']}
                />
            </UnmountClosed>
        </div>
    );
};

export default Datovelger;
