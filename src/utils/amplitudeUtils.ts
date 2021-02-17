import amplitude from './amplitudeInstance';
import amplitudevalues from './amplitudevalues.json';

const miljo = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';
const defaultkey = '#arbeidsgiver-permittering-'.concat(miljo);

export const skrivTilMalingBesokerSide = (): void => {
    amplitude.logEvent(defaultkey.concat('-brukerbesokersiden'));
};

export const skrivTilMalingMenyValg = (key: string): void => {
    const jsonsection = 'menyvalg';
    amplitudevalues.forEach((value: any) => {
        if (value[jsonsection][key]) {
            amplitude.logEvent(
                defaultkey
                    .concat('-')
                    .concat(jsonsection)
                    .concat(value[jsonsection][key])
            );
        }
    });
};

export const skrivTilMalingBesokerSideGaTilSkjema = (): void => {
    amplitude.logEvent(defaultkey.concat('-gaTilsoknadSkjema'));
};

export const skrivTilMalingFantDuIkkeDetDuLetteEtter = (): void => {
    amplitude.logEvent(defaultkey.concat('-brukerFantIkke'));
};

export const skrivTilMalingBrukerTrykketPaSporsmal = (
    hopplenke: string
): void => {
    amplitude.logEvent(defaultkey.concat('-').concat(hopplenke));
};

export const skrivTilMalingVideoBlirSpilt = (event: any): void => {
    const attributeName = 'amplitude-tracked';
    const played = event.target.currentTime / event.target.duration;
    const amplitudeTracked = event.target.getAttribute(attributeName);
    if (played > 0.5 && amplitudeTracked !== '50') {
        amplitude.logEvent(defaultkey.concat('-video-spilt-av'), {
            src: event.target.currentSrc,
        });
        event.target.setAttribute(attributeName, '50');
    }
};
