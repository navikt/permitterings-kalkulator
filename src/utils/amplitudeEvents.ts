import amplitude from '../utils/amplitudeInstance';

export const loggSidevinsing = () => {
    amplitude.logEvent('sidevisning', {
        url: 'https://arbeidsgiver.nav.no/min-side-arbeidsgiver/',
    });
};
