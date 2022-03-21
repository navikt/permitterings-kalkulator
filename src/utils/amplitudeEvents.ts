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
