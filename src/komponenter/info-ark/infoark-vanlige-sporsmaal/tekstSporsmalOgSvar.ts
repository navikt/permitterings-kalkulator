interface TekstSporsmalOgSvar {
    tittel: string;
    id: string;
}

export const tekstseksjonsSporsmal: TekstSporsmalOgSvar[] = [
    {
        tittel: 'Kan jeg permittere ansatte som er sykmeldt?',
        id: '#kanJegPermittere',
    },
    {
        tittel: 'Kan jeg permittere en ansatt som får omsorgspenger?',
        id: '#kanJegPermittereOmsorgspenger',
    },
    {
        tittel: 'Skal tilkallingsvikarene ha permitteringsvarsel?',
        id: '#skalTilkallingsvikarene',
    },
    {
        tittel: 'Hvor lenge skal jeg betale lønn?',
        id: '#hvordanSkalJegBeregne',
    },

    {
        tittel:
            'Jeg har allerede betalt lønn i mer enn to dager, får jeg disse pengene tilbake?',
        id: '#jegHarAllerede',
    },
    {
        tittel:
            'Hvordan kan jeg være sikker på at permitteringen er gyldig, og at de ansatte får pengene sine?',
        id: '#hvordanKanJegVare',
    },
    {
        tittel: 'Fant du ikke det du lette etter?',
        id: '#fantDuIkke',
    },
];
