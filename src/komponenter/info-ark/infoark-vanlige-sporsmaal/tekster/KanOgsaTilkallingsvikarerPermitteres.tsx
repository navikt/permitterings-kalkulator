import React from 'react';
import { Normaltekst } from 'nav-frontend-typografi';

const KanOgsaTilkallingsvikarerPermitteres = () => {
    return (
        <>
            <Normaltekst>
                Du skal kun varsle tilkallingsvikarer som har oppdrag om
                permittering. Dersom tilkallingsvikaren ikke har oppdrag kan du
                bli bedt om å bekrefte mangel på oppdrag, slik at
                tilkallingsvikaren kan legge denne bekreftelsen ved søknad om
                dagpenger.{' '}
            </Normaltekst>
            <Normaltekst className="textair">
                Har tilkallingsvikaren avtale om å jobbe i en periode og rammes
                av permitteringen, skal du varsle vikaren på vanlig måte.
                Permitteringen gjelder kun så lenge den avtalte vikarjobben
                varer. Det vil si siste dagen for det avtalte oppdraget.
            </Normaltekst>
        </>
    );
};

export default KanOgsaTilkallingsvikarerPermitteres;
