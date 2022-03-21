import amplitude from '../utils/amplitudeInstance';

export const loggSidevinsing = () => {
    amplitude.logEvent('sidevisning', {
        url: 'https://arbeidsgiver.nav.no/permittering-kalkulator/',
    });
};

export const loggKnappTrykketPå = (label: String) => {
    amplitude.logEvent('knapp trykket på', {
        url: 'https://arbeidsgiver.nav.no/permittering-kalkulator/',
        label: label,
    });
};

export const loggPermitteringsSituasjon = (
    situasjon: String,
    regelverk: string
) => {
    amplitude.logEvent('sidevisning', {
        url: 'https://arbeidsgiver.nav.no/permittering-kalkulator/',
        situasjon: situasjon,
        regelverk: regelverk,
    });
};

export const logSekunderBruktFørBrukerFyllerInn = (
    antallSekunder: number | undefined
) => {
    if (antallSekunder === undefined) {
        amplitude.logEvent('knapp trykket på', {
            url: 'https://arbeidsgiver.nav.no/permittering-kalkulator/',
            tidsbruk: 'bruker fylte ikke inn data',
        });
        return;
    }
    let antallSekunderBolkString = '';
    if (antallSekunder <= 30) {
        antallSekunderBolkString = 'mindre enn 30 sekunder';
    } else if (antallSekunder <= 120) {
        antallSekunderBolkString = 'mindre enn 2 minutter';
    } else if (antallSekunder <= 240) {
        antallSekunderBolkString = 'mindre enn 4 minutter';
    } else if (antallSekunder <= 480) {
        antallSekunderBolkString = 'mindre enn 8 minutter';
    } else {
        antallSekunderBolkString = 'mer enn 8 minutter';
    }
    amplitude.logEvent('knapp trykket på', {
        url: 'https://arbeidsgiver.nav.no/permittering-kalkulator/',
        tidsbruk: 'brukte: ' + antallSekunderBolkString,
    });
};
