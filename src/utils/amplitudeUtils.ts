import amplitude from './amplitude';
import amplitudevalues from './amplitudevalues.json';

const miljo = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';
const defaultkey = '#arbeidsgiver-permittering-'.concat(miljo);

export const skrivTilMalingBesokerSide = () => {
    amplitude.logEvent(defaultkey.concat('-brukerbesokersiden'));
};

export const skrivTilMalingMenyValg = (key: string) => {
    const jsonsection = 'menyvalg';
    amplitudevalues.map((value: any) => {
        if (value[jsonsection][key]) {
            return amplitude.logEvent(
                defaultkey
                    .concat('-')
                    .concat(jsonsection)
                    .concat(value[jsonsection][key])
            );
        }
        return null;
    });
};

export const skrivTilMalingBesokerSideGaTilSkjema = () => {
    amplitude.logEvent(defaultkey.concat('-gaTilsoknadSkjema'));
};

export const skrivTilMalingFantDuIkkeDetDuLetteEtter = () => {
    amplitude.logEvent(defaultkey.concat('-brukerFantIkke'));
};

export const skrivTilMalingVideoBlirSpilt = (event: any) => {
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
