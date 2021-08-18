import amplitude from '../utils/amplitudeInstance';

export const loggSidevinsing = () => {
    amplitude.logEvent('sidevisning', {
        url: 'https://arbeidsgiver.nav.no/min-side-arbeidsgiver/',
    });
};

export const loggKnappTrykketPå = (label: String) => {
    amplitude.logEvent('knapp trykket på', {
        url: 'https://arbeidsgiver.nav.no/min-side-arbeidsgiver/',
        label: label,
    });
};

export const loggPermitteringsSituasjon = (situasjon: String) => {
    amplitude.logEvent('sidevisning', {
        url: 'https://arbeidsgiver.nav.no/min-side-arbeidsgiver/',
        situasjon: situasjon,
    });
};
